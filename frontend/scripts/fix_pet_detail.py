import sys

with open('src/pages/pets/PetDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<img src={pet.photoUrl} alt={pet.name} className=\"w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-1000 group-hover:scale-105\" />',
    '{pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className=\"w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-1000 group-hover:scale-105\" /> : <div className=\"w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/20\"><span className=\"text-4xl font-serif mb-2\">{pet.name.charAt(0)}</span><span className=\"text-xs font-bold uppercase tracking-widest\">No Photo</span></div>}'
)

content = content.replace(
    '<img \n                  src={pet.photoUrl} \n                  alt=\"Nose print biometric\" \n                  className=\"w-full h-full object-cover mix-blend-multiply opacity-90\" \n                />',
    '{pet.photoUrl ? <img src={pet.photoUrl} alt=\"Nose print biometric\" className=\"w-full h-full object-cover mix-blend-multiply opacity-90\" /> : <div className=\"w-full h-full bg-[var(--color-ink)]/5\" />}'
)

with open('src/pages/pets/PetDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
