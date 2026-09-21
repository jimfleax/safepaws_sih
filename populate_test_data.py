import requests

s = requests.Session()
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo'
s.headers.update({'Authorization': f'Bearer {token}'})

# Update profile
s.put('http://localhost:5000/api/v1/users/profile', json={
    'name': 'Test Owner', 'phone': '1234567890', 'neighborhood': 'Downtown'
})

# Create Pet
r = s.post('http://localhost:5000/api/v1/pets/register', json={
    'name': 'Doggo', 'species': 'dog', 'breed': 'golden',
    'color': 'golden', 'weight': '20', 'age': '2', 'owner_name': 'Test Owner',
    'owner_phone': '1234567890', 'neighborhood': 'Downtown',
    'distinctive_features': [],
    'diet_notes': '', 'medical_notes': '', 'reward': '', 'consent_given': True
})
pet = r.json()
print("Pet created", pet)
if 'id' in pet:
    pet_id = pet['id']
    # Create Alert
    r = s.post('http://localhost:5000/api/v1/alerts/', json={
        'pet_id': pet_id, 'status': 'missing', 'location_lat': 40.71, 'location_lng': -74.00,
        'description': 'Help', 'last_seen_address': 'Central Park'
    })
    alert = r.json()
    print("Alert created", alert)

# Create Post
r = s.post('http://localhost:5000/api/v1/community/posts', json={
    'title': 'Test post', 'content': 'Hello community', 'category': 'discussion', 'channel': 'general', 'is_anonymous': False
})
print("Post created", r.json())
