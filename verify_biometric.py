import requests
import json
import uuid

base_url = "http://localhost:5000/api/v1"
s = requests.Session()
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo'
s.headers.update({'Authorization': f'Bearer {token}'})

def main():
    pet_name = f"TestBioDog-{uuid.uuid4().hex[:6]}"
    print(f"--- 1. Register Pet: {pet_name} ---")
    payload = {
        "name": pet_name,
        "species": "Dog",
        "breed": "Labrador",
        "color": "Black",
        "age": "2",
        "owner_name": "Test Owner",
        "owner_phone": "1234567890",
        "neighborhood": "Testville",
        "consent_given": True
    }
    r1 = s.post(f"{base_url}/pets/register", json=payload)
    print("Register Status:", r1.status_code)
    if r1.status_code != 201:
        print(r1.text)
        return
    pet_id = r1.json()['id']
    print("Pet ID:", pet_id)

    print("\n--- 2. Enroll Image ---")
    with open('dog_nose.jpg', 'rb') as f:
        files = {'file': ('dog_nose.jpg', f, 'image/jpeg')}
        # Ensure we don't send JSON Content-Type for multipart/form-data
        r2 = s.post(f"{base_url}/pets/{pet_id}/enroll-image", files=files)
    print("Enroll Status:", r2.status_code)
    if r2.status_code != 200:
        print(r2.text)
        return
    print("Enroll Response:", r2.json())

    print("\n--- 3. Identify Image ---")
    # Identify using the same image
    with open('dog_nose.jpg', 'rb') as f:
        files = {'file': ('dog_nose.jpg', f, 'image/jpeg')}
        r3 = s.post(f"{base_url}/pets/identify", files=files)
    print("Identify Status:", r3.status_code)
    if r3.status_code == 200:
        res = r3.json()
        print("Identify Status Field:", res.get('status'))
        print("Matches:", res.get('matches'))
    else:
        print(r3.text)

if __name__ == "__main__":
    main()
