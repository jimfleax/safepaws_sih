import os
import random
from PIL import Image

def create_mock_embedding_dataset(base_dir="dataset/embedding", num_classes=10, imgs_per_class_train=10, imgs_per_class_val=3, img_size=(128, 128)):
    """
    Generates a mock dataset for Biometric Embedding model training.
    Creates folder structure suitable for torchvision ImageFolder.
    """
    for split in ["train", "val"]:
        split_dir = os.path.join(base_dir, split)
        imgs_per_class = imgs_per_class_train if split == "train" else imgs_per_class_val
        
        for cls_id in range(num_classes):
            cls_dir = os.path.join(split_dir, f"dog_{cls_id:03d}")
            os.makedirs(cls_dir, exist_ok=True)
            
            for i in range(imgs_per_class):
                img_path = os.path.join(cls_dir, f"img_{i:03d}.jpg")
                img = Image.new('RGB', img_size, color=(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
                img.save(img_path)
                
    print(f"Mock Embedding dataset created at {base_dir}")

if __name__ == "__main__":
    create_mock_embedding_dataset()
