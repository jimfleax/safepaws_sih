import os
try:
    from ultralytics import YOLO
    model = YOLO('yolov8n.pt')
    print("YOLOv8n downloaded.")
except Exception as e:
    print(f"YOLO fail: {e}")

try:
    import torch
    import torchvision.models as models
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    model.classifier = torch.nn.Identity()
    os.makedirs('model_weights', exist_ok=True)
    torch.save(model, 'model_weights/embedding_v1.pt')
    import json
    with open('model_weights/checkpoint.json', 'w') as f:
        json.dump({
            "embedding_dimension": 1280,
            "backbone_architecture": "mobilenet_v2",
            "seed": 42
        }, f)
    print("MobileNetV2 downloaded and saved.")
except Exception as e:
    print(f"Torch fail: {e}")
