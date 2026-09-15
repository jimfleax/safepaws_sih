import requests
import io
import os
from PIL import Image
import numpy as np

BASE_URL = "http://localhost:8000/api/v1"

print("1. Health Check")
res = requests.get(f"{BASE_URL}/health/")
print(res.json())
assert res.status_code == 200

print("\n2. Register Pet")
pet_data = {
    "name": "Rex",
    "species": "Dog",
    "breed": "Golden Retriever",
    "color": "Golden",
    "age": "3",
    "weight": "30.5",
    "owner_name": "John Doe",
    "owner_phone": "555-1234",
    "neighborhood": "Downtown",
    "consent_given": True
}
res = requests.post(f"{BASE_URL}/pets/register", json=pet_data)
pet_info = res.json()
print(pet_info)
assert res.status_code in [200, 201]
pet_id = pet_info["id"]

print("\n3. Enroll Image")
# Generate a highly noisy image to pass the laplacian variance gate
noise = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
img = Image.fromarray(noise, 'RGB')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)
files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}
res = requests.post(f"{BASE_URL}/pets/"+pet_id+"/enroll-image", files=files)
print(res.json())
assert res.status_code in [200, 201]

print("\n4. Identify Image (Match)")
img_byte_arr.seek(0)
files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}
res = requests.post(f"{BASE_URL}/pets/identify", files=files)
match_data = res.json()
print(match_data)
assert res.status_code in [200, 201]
assert match_data["status"] == "MATCH"
assert match_data["matches"][0]["pet_id"] == pet_id

print("\n5. Get Profile")
res = requests.get(f"{BASE_URL}/pets/"+pet_id)
print(res.json())
assert res.status_code in [200, 201]

print("\n6. Sighting Persistence")
sighting_data = {
    "reporter_name": "Jane",
    "location": "Park",
    "notes": "Saw him!"
}
res = requests.post(f"{BASE_URL}/sightings/", json=sighting_data)
print(res.json())
assert res.status_code in [200, 201]

print("\n7. Controlled Failure (Invalid Image)")
files = {'file': ('test.txt', io.BytesIO(b"not an image"), 'text/plain')}
res = requests.post(f"{BASE_URL}/pets/identify", files=files)
print(f"Status: {res.status_code}, Body: {res.text}")
assert res.status_code in [400, 415, 422]

print("\nALL BACKEND SMOKE TESTS PASSED!")
