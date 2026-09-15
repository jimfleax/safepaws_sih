import os
import random
from PIL import Image

def create_mock_yolo_dataset(base_dir="dataset/yolo", num_train=50, num_val=10, img_size=(256, 256)):
    """
    Generates a mock dataset for YOLO-nano training.
    Creates images and corresponding label texts with bounding boxes.
    """
    for split in ["train", "val"]:
        img_dir = os.path.join(base_dir, "images", split)
        lbl_dir = os.path.join(base_dir, "labels", split)
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(lbl_dir, exist_ok=True)
        
        num_images = num_train if split == "train" else num_val
        for i in range(num_images):
            img_path = os.path.join(img_dir, f"img_{i:04d}.jpg")
            img = Image.new('RGB', img_size, color=(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
            img.save(img_path)
            
            lbl_path = os.path.join(lbl_dir, f"img_{i:04d}.txt")
            with open(lbl_path, "w") as f:
                f.write(f"0 {random.uniform(0.1, 0.9):.3f} {random.uniform(0.1, 0.9):.3f} {random.uniform(0.1, 0.5):.3f} {random.uniform(0.1, 0.5):.3f}\n")
                
    print(f"Mock YOLO dataset created at {base_dir}")

if __name__ == "__main__":
    create_mock_yolo_dataset()
