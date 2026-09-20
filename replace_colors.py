import os
import re

files_to_check = [
    'frontend/src/pages/Dashboard.tsx',
    'frontend/src/pages/SetupProfile.tsx',
    'frontend/src/pages/pets/NewPet.tsx',
    'frontend/src/App.tsx',
    'frontend/src/components/PageLoader.tsx',
    'frontend/src/components/Footer.tsx'
]

replacements = {
    '#1C1A17': 'var(--color-ink)',
    '#2A2723': 'var(--color-ink-soft)',
    '#F6F1E7': 'var(--color-bone)',
    '#E2811F': 'var(--color-marigold)',
    '#CA721A': 'var(--color-marigold)',
    '#B3452F': 'var(--color-alert-clay)',
    '#9A3926': 'var(--color-alert-clay)',
    '#63684B': 'var(--color-trail)',
    '#E5E0D8': 'var(--color-border)',
    '#4C7A52': 'var(--color-success)',
}

for file_path in files_to_check:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, does not exist.")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for hex_code, var_name in replacements.items():
        # Handle cases like bg-[#1C1A17] or text-[#1C1A17] or border-[#1C1A17]
        content = re.sub(rf'\[{hex_code}\](?!\/)', f'[{var_name}]', content, flags=re.IGNORECASE)
        # Handle opacities like bg-[#1C1A17]/10 -> bg-[var(--color-ink)]/10, though in standard Tailwind you might need bg-[var(--color-ink)]/10 or just let it be. Actually tailwind allows bg-[var(--color-ink)]/10 in v4? Yes.
        content = re.sub(rf'\[{hex_code}\]', f'[{var_name}]', content, flags=re.IGNORECASE)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {file_path}")
