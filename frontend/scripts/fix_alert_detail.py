import re

with open('src/pages/AlertDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<img\s+src=\{alert\.photoUrl\}\s+alt=\{alert\.petName\}\s+className=\"w-full h-full object-cover grayscale-\[20\%\]\"\s*/>'
replacement = r'{alert.photoUrl ? <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover grayscale-[20%]" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/20 bg-[#F4EDE4]"><span className="text-6xl font-serif mb-2">{alert.petName.charAt(0)}</span><span className="text-xs font-bold uppercase tracking-widest mt-4">No Photo</span></div>}'

content = re.sub(pattern, replacement, content)

with open('src/pages/AlertDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
