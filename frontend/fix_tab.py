import sys

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    for line in lines:
        if 'ransition-opacity duration-500 }' in line:
            f.write('          <section className={	ransition-opacity duration-500 }>\n')
        else:
            f.write(line)
