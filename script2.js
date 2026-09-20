const fs = require('fs');
let code = fs.readFileSync('frontend/src/utils/apiClient.ts', 'utf8');

const fetchPattern = /fetch\(([^,]+),\s*(\{[\s\S]*?\})\s*\);/g;
code = code.replace(fetchPattern, (match, url, options) => {
  if (options.includes('credentials')) return match;
  // insert credentials: 'include' just before the last closing brace
  const newOptions = options.replace(/\}\s*$/, , credentials: 'include' });
  return etch(, );;
});

const fetchOneArg = /fetch\(([^]+|'[^']+')\);/g;
code = code.replace(fetchOneArg, (match, url) => {
  return etch(, { credentials: 'include' });;
});

fs.writeFileSync('frontend/src/utils/apiClient.ts', code);
