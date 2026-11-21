import re

with open('src/pages/pets/PetDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<img\s+src=\{pet\.photoUrl\}\s+alt=\{pet\.name\}\s+className=\"w-full h-full object-cover grayscale-\[20\%\] contrast-110\"\s*/>',
    r'{pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className=\"w-full h-full object-cover grayscale-[20%] contrast-110\" /> : <div className=\"w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/20 bg-[#F4EDE4]\"><span className=\"text-6xl font-serif mb-2\">{pet.name.charAt(0)}</span><span className=\"text-xs font-bold uppercase tracking-widest mt-4\">No Photo</span></div>}',
    content
)

with open('src/pages/pets/PetDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
