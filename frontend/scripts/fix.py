with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()
content = content.replace('className={transition-opacity', 'className={	ransition-opacity')
content = content.replace('hover:opacity-100\" : \"\"}', 'hover:opacity-100\" : \"\"}}')
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
