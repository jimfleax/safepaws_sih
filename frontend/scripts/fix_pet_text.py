import re

with open('src/pages/pets/PetDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('leading-none tracking-tight mb-2', 'leading-tight tracking-tight mb-2 pb-2')

with open('src/pages/pets/PetDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
