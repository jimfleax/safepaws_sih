import pytest
import numpy as np
import json
import os
from pathlib import Path
from backend.scripts.evaluate import compute_eer, evaluate_verification, validate_identity_disjoint, main

def test_eer_calculation():
    # If fpr and fnr cross perfectly
    fpr = np.array([0.0, 0.1, 0.2, 0.3])
    tpr = np.array([0.7, 0.8, 0.9, 1.0]) # fnr = [0.3, 0.2, 0.1, 0.0]
    # fpr and fnr cross at index 1: fpr=0.1, fnr=0.2 (diff=0.1) or index 2: fpr=0.2, fnr=0.1 (diff=0.1)
    thresholds = np.array([0.9, 0.8, 0.7, 0.6])
    eer, thresh = compute_eer(fpr, tpr, thresholds)
    assert round(eer, 1) in [0.1, 0.2]

def test_score_direction_and_auc():
    # Genuine = 1, Impostor = 0. Higher score = stronger match
    labels = [1, 1, 0, 0]
    scores = [0.9, 0.8, 0.2, 0.1]
    # Perfect separation, AUC should be 1.0
    results = evaluate_verification(scores, labels)
    assert results["AUC"] == 1.0
    assert results["EER"] == 0.0
    
def test_insufficient_dataset():
    labels = [1]
    scores = [0.9]
    with pytest.raises(ValueError, match="Insufficient dataset"):
        evaluate_verification(scores, labels)

def test_identity_disjoint_validation():
    train = {1, 2, 3}
    val = {4, 5}
    test = {6, 7}
    # Should pass
    validate_identity_disjoint(train, val, test)
    
    # Should fail
    val_bad = {3, 4}
    with pytest.raises(ValueError, match="Train and Validation splits have overlapping identities."):
        validate_identity_disjoint(train, val_bad, test)

def test_synthetic_safety_path(tmp_path, monkeypatch):
    # Execute main with non-existent dataset to trigger synthetic path
    out_file = tmp_path / "out.json"
    
    # Mock sys.argv
    import sys
    monkeypatch.setattr(sys, 'argv', ['evaluate.py', '--dataset-path', 'non_existent.json', '--output', str(out_file)])
    
    main()
    
    assert out_file.exists()
    with open(out_file, "r") as f:
        data = json.load(f)
        
    assert "_WARNING" in data
    assert "SYNTHETIC SCAFFOLD DATA" in data["_WARNING"]
    assert data["metrics"]["verification"]["AUC"] > 0
