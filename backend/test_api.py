import requests

url = "http://localhost:8000/api/v1/pets/"
cookies = {"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNzUyOH0._5ZpyOKSWOC05x4wWr37789CjjXRyjKnN9o2SLOxQt8"}
response = requests.get(url, cookies=cookies)
print(response.json())
