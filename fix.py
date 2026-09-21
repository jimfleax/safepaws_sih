import re
with open('backend/app/api/v1/endpoints/community.py', 'r') as f:
    content = f.read()
content = re.sub(r'@router.delete\(''/posts/\{post_id\}'', status_code=204\)\nasync def delete_post\([\s\S]*?\) -> Any:', lambda m: m.group(0).replace('-> Any:', '-> None:'), content)
content = re.sub(r'@router.delete\(''/replies/\{reply_id\}'', status_code=204\)\nasync def delete_reply\([\s\S]*?\) -> Any:', lambda m: m.group(0).replace('-> Any:', '-> None:'), content)
with open('backend/app/api/v1/endpoints/community.py', 'w') as f:
    f.write(content)
