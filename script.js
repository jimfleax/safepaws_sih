const fs = require('fs');
let code = fs.readFileSync('frontend/src/utils/apiClient.ts', 'utf8');

// replace fetch('/api/v1/pets/register', { ... })
code = code.replace(/fetch\('([^']+)',\s*{([\s\S]*?)}\);/g, (match, url, options) => {
  if (options.includes('credentials')) return match;
  return etch('', {, credentials: 'include' });;
});

// For fetches with only 1 argument (e.g. fetch(/api/v1/pets/))
code = code.replace(/fetch\(([^]+|'[^']+')\);/g, (match, url) => {
  return etch(, { credentials: 'include' });;
});

fs.writeFileSync('frontend/src/utils/apiClient.ts', code);
