import re

with open('frontend/src/utils/apiClient.ts', 'r', encoding='utf-8') as f:
    code = f.read()

def replacer1(m):
    url = m.group(1)
    options = m.group(2)
    if 'credentials' in options: return m.group(0)
    
    # insert credentials: 'include' before the last closing brace
    idx = options.rfind('}')
    new_options = options[:idx] + ", credentials: 'include' " + options[idx:]
    return f"fetch({url}, {new_options});"

code = re.sub(r"fetch\(([^,]+),\s*(\{[\s\S]*?\})\s*\);", replacer1, code)

def replacer2(m):
    url = m.group(1)
    return f"fetch({url}, {{ credentials: 'include' }});"

code = re.sub(r"fetch\(([^]+|'[^']+')\);", replacer2, code)

with open('frontend/src/utils/apiClient.ts', 'w', encoding='utf-8') as f:
    f.write(code)
