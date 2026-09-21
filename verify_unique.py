import requests
import uuid

base_url = "http://localhost:5000/api/v1"
s = requests.Session()
# Use test-owner-1 token
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo'
s.headers.update({'Authorization': f'Bearer {token}'})

def main():
    pet_name = f"UniqueDog-{uuid.uuid4().hex[:6]}"
    print(f"--- 1. Register Pet: {pet_name} ---")
    payload = {
        "name": pet_name,
        "species": "Dog",
        "breed": "Beagle",
        "color": "Brown/White",
        "age": "3",
        "owner_name": "Test Owner",
        "owner_phone": "1234567890",
        "neighborhood": "Testville",
        "consent_given": True
    }
    r1 = s.post(f"{base_url}/pets/register", json=payload)
    print("Register Status:", r1.status_code)
    pet_id = r1.json()['id']
    print("Pet ID:", pet_id)

    print("\n--- 2. Enroll Unique Image ---")
    with open('unique_dog.jpg', 'rb') as f:
        files = {'file': ('unique_dog.jpg', f, 'image/jpeg')}
        r2 = s.post(f"{base_url}/pets/{pet_id}/enroll-image", files=files)
    print("Enroll Status:", r2.status_code)

    print("\n--- 3. Identify Image ---")
    with open('unique_dog.jpg', 'rb') as f:
        files = {'file': ('unique_dog.jpg', f, 'image/jpeg')}
        r3 = s.post(f"{base_url}/pets/identify", files=files)
    print("Identify Status:", r3.status_code)
    res = r3.json()
    print("Identify Status Field:", res.get('status'))
    matches = res.get('matches', [])
    if matches:
        top = matches[0]
        print("Top Match Pet ID:", top.get('pet_id'))
        print("Top Match QR Tag ID:", top.get('qr_tag_id'))
        print("Top Match Confidence:", top.get('confidence'))
        
        # Save qrTagId for the next step
        with open('last_qr_tag.txt', 'w') as f2:
            f2.write(top.get('qr_tag_id') or '')
    else:
        print("No matches returned!")

if __name__ == "__main__":
    main()
