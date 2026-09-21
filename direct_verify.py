import requests

s = requests.Session()
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo'
s.headers.update({'Authorization': f'Bearer {token}'})

# 1. Dashboard
r = s.get('http://localhost:5000/api/v1/pets/')
print("Pets (GET /pets/):", r.status_code)
if r.status_code == 200:
    pets = r.json()
    if pets:
        pet_id = pets[0]['id']
        r_alerts = s.get('http://localhost:5000/api/v1/alerts/')
        alerts = r_alerts.json()
        my_alert = next((a for a in alerts if a['pet_id'] == pet_id), None)
        
        if my_alert:
            alert_id = my_alert['id']
            # 2. Alert Detail
            r2 = s.get(f'http://localhost:5000/api/v1/alerts/{alert_id}')
            print("Alert Detail:", r2.status_code)

            # 3. Resolve
            r3 = s.put(f'http://localhost:5000/api/v1/alerts/{alert_id}/resolve')
            print("Resolve Alert:", r3.status_code)
        
        # also test wrong owner
        wrong_alert = next((a for a in alerts if a['pet_id'] != pet_id), None)
        if wrong_alert:
            r_wrong = s.put(f'http://localhost:5000/api/v1/alerts/{wrong_alert["id"]}/resolve')
            print("Resolve Wrong Alert (403 expected):", r_wrong.status_code)

# 4. Anonymous Sighting
r = s.get('http://localhost:5000/api/v1/pets/')
if r.status_code == 200:
    pets = r.json()
    if pets:
        tag_id = pets[0]['qr_tag_id']
        r4 = requests.get(f'http://localhost:5000/api/v1/pets/tag/{tag_id}')
        print("Public Pet Profile:", r4.status_code)
        
        r5 = requests.post('http://localhost:5000/api/v1/sightings/', json={
            'location': 'Test Location', 'reporter_name': 'Anon Finder', 'notes': '', 'alert_id': None
        })
        print("Submit Sighting:", r5.status_code)
else:
    print("GET /pets/ failed:", r.status_code, r.text)

# 5. Community Flow
r = s.get('http://localhost:5000/api/v1/community/posts')
print("Community Posts:", r.status_code)
if r.status_code == 200:
    posts = r.json()
    if posts:
        post_id = posts[0]['id']
        r6 = s.get(f'http://localhost:5000/api/v1/community/posts/{post_id}')
        print("Community Post Detail:", r6.status_code)
        
        r7 = s.post(f'http://localhost:5000/api/v1/community/posts/{post_id}/replies', json={
            'content': 'Test reply', 'is_anonymous': False
        })
        print("Community Reply:", r7.status_code)

# 6. ML Scan flow
with open('test_dog.jpg', 'rb') as f:
    files = {'file': ('test_dog.jpg', f, 'image/jpeg')}
    r8 = requests.post('http://localhost:5000/api/v1/pets/identify', files=files)
    print("ML Scan:", r8.status_code, r8.text[:100])
