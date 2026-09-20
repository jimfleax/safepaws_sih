import re

with open('frontend/src/utils/apiClient.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace fetch(url, { ... })
def replacer1(m):
    url, options = m.groups()
    if 'credentials' in options: return m.group(0)
    # Ensure options string is properly separated
    if not options.strip().endswith(','):
        options += ','
    return f"fetch({url}, {{{options} credentials: 'include' }});"

code = re.sub(r"fetch\(([^,]+),\s*\{([^}]*)\}\);", replacer1, code)

# Replace fetch(url)
def replacer2(m):
    url = m.group(1)
    return f"fetch({url}, {{ credentials: 'include' }});"

code = re.sub(r"fetch\(([^]+|'[^']+')\);", replacer2, code)

with open('frontend/src/utils/apiClient.ts', 'w', encoding='utf-8') as f:
    f.write(code)
