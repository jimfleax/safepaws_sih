# SafePaws ML Pipeline Documentation

## 1. Architecture
The SafePaws ML backend uses a decoupled pipeline consisting of:
1. **Nose Detection**: YOLO-based detector locating the dog nose. (Panel 2)
2. **Quality Gate**: Classical computer vision checks (Laplacian variance) and detector confidence score. (Panel 2)
3. **Biometric Embedding**: Metric-learning trained model extracting a 1280-d identity vector. (Panel 3)
4. **Vector Search**: FAISS index configured with L2 normalization mapping UUIDs to internal IDs. (Panel 4)

## 2. Dataset Provenance
**EXTERNAL BLOCKER**: Currently, no sufficiently large, publicly accessible dog nose biometric dataset with identity-disjoint splits is available for free without registration delays or usage constraints.
Therefore, a true identity-verified dog nose dataset could not be downloaded for training.
In its place, we have created a robust, reproducible dataset structure that is ready to ingest a real dataset when one is acquired.

## 3. Data Split Methodology
When real data is supplied, the pipeline implements an **Identity-Disjoint Split**:
- Identities (dogs) present in the training set are strictly prohibited from appearing in the validation or test sets.
- This ensures evaluation metrics reflect generalizability to *new* dogs, avoiding identity leakage.

## 4. Training Procedure
- The BiometricTrainer orchestrates deep metric learning.
- **Loss**: Triplet Loss with semi-hard negative mining.
- **Augmentation**: Random crops, rotations, color jitter (configured for nose prints).

## 5. Model Architecture
- **Detector**: YOLOv8 Nano (yolov8n). Selected for speed/CPU compatibility.
- **Embedding Backbone**: MobileNetV2. Feature extractor stripped of its classification head, outputting 1280-d embeddings. MobileNetV2 is optimized for mobile/CPU inference latency.

## 6. Checkpoint Location
- Detector: yolov8n.pt
- Embedder: ackend/model_weights/embedding_v1.pt
- Metadata: ackend/model_weights/checkpoint.json

## 7. Evaluation Methodology
- 1:1 Verification protocol across identity-disjoint test set.
- Metrics measured:
  - ROC curve & AUC
  - Equal Error Rate (EER)
  - True Accept Rate (TAR) at fixed False Accept Rates (FAR = 0.1%, 1%, 10%).

## 8. Threshold Calibration
**LIMITATION**: Due to the dataset blocker, the embedding model relies on a pretrained generic backbone instead of a metric-learned nose biometric backbone.
As a result, similarity distributions are not biologically calibrated.
- **MATCH_THRESHOLD**: 0.85 (Provisional placeholder, requires calibration on a real dataset)
- **AMBIGUOUS_THRESHOLD**: 0.70 (Provisional placeholder, requires calibration)

## 9. API Integration
The frontend integrates with stable backend contracts:
- POST /pets/{pet_id}/enroll-image
- POST /pets/identify
- POST /pets/verify
The backend orchestrates the ML steps securely. 

## 10. Local Setup
Ensure Python 3.10+ is installed.
`ash
cd backend
pip install -r requirements.txt
pip install torch torchvision ultralytics --index-url https://download.pytorch.org/whl/cpu
`

## 11. Training Command
`ash
python scripts/train.py --config config.json
`

## 12. Evaluation Command
`ash
python scripts/evaluate.py --dataset-path data/evaluation.json
`

## 13. Demo Command
To seed the FAISS index with a demo gallery:
`ash
python scripts/seed_demo_gallery.py
`

## 14. Known Limitations
1. **Dataset Unavailability**: We lack a true biometric identity dataset for dog noses. 
2. **Detector Accuracy**: YOLOv8n is pretrained on COCO (detects whole dogs). A true nose model requires finetuning.
3. **Embedding Specificity**: MobileNetV2 pretrained on ImageNet produces semantic features, but not true discriminative biometric features for noses. FAR/FRR metrics will be poor until finetuning is possible.

---
**Explicit Component Status:**
- REAL MODEL: ✅ (Using MobileNetV2 & YOLOv8n code path)
- REAL DATA: 🚫 (BLOCKED BY DATASET UNAVAILABILITY)
- REAL EVALUATION: 🚫 (BLOCKED BY DATASET UNAVAILABILITY)
- DEMO GALLERY: ✅ (Supported via FAISS vector addition)
- MOCK/TEST SCAFFOLD: ⚠️ (Previously active, now disabled in config for production pathway)
