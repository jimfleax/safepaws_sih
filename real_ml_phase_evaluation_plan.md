# Real ML Phase Evaluation Plan

## Scientific Protocol & Integrity

This document outlines the scientific protocol for the future training, validation, and deployment of the real biometric embedding model for SAFEPAWS. As noted in our primary documentation, the current hackathon build uses a structural scaffold for demonstration purposes and makes no claims regarding real-world biometric accuracy.

### 1. Data Collection & Preprocessing
- **Dataset Generation:** Collect a diverse, large-scale dataset of animal images, specifically targeting the species of interest.
- **Annotation:** Ensure precise landmark and bounding box annotations for faces and unique physical traits.
- **Data Augmentation:** Apply rigorous augmentations (lighting variations, occlusion, varying angles, different background environments) to simulate real-world field conditions.

### 2. Model Architecture & Training
- **Architecture Selection:** Utilize state-of-the-art vision models (e.g., Vision Transformers or ResNet derivatives) tuned for fine-grained feature extraction.
- **Loss Functions:** Implement contrastive loss or triplet margin loss to ensure embeddings of the same animal are tightly clustered while distinct animals are pushed apart in the vector space.
- **Training Integrity:** Maintain strict separation of training, validation, and hold-out test sets to prevent data leakage and ensure true zero-shot/few-shot generalization.

### 3. Evaluation Metrics
The model will be evaluated based on the following standard metrics:
- **Rank-1 / Rank-5 Accuracy:** To measure identification success rates in top retrievals.
- **False Acceptance Rate (FAR) & False Rejection Rate (FRR):** Critical for preventing misidentification of pets.
- **Mean Average Precision (mAP):** To assess the overall quality and ranking of the vector retrieval space.
- **Robustness Testing:** Evaluating performance degradation against out-of-distribution environmental factors (e.g., night-time captures, low resolution, motion blur).

### 4. Real-World Validation
- **Field Testing:** Partner with local shelters, animal control, and veterinary clinics to test the application in real-world scenarios.
- **Blind Tests:** Conduct blind verification tests where the model's predictions are compared against ground-truth microchip data or manual expert identification.
- **Continuous Monitoring:** Post-deployment tracking of prediction confidence scores to identify data drift and trigger periodic retraining cycles.

### 5. Ethical & Scientific Disclaimer
We commit to scientific integrity by acknowledging the limitations of our current prototype. Transitioning from the current scaffold to a production-grade biometric system requires rigorous, peer-reviewable validation steps as outlined above. We will not deploy the ML model into production for real-world reliance until these scientific benchmarks have been demonstrably met.
