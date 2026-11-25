with open('src/pages/pets/PetDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r'\"', '\"')

with open('src/pages/pets/PetDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
