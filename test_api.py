import requests
print(requests.get('http://localhost:5000/api/v1/community/posts').text)
