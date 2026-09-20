const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if(file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/pages');
for (let file of files) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('\n--- ' + file + ' ---');
  let buttons = content.match(/<button[^>]*>.*?<\/button>/gs) || [];
  let links = content.match(/<Link[^>]*>.*?<\/Link>/gs) || [];
  buttons.forEach(b => {
    let onClick = b.match(/onClick=\{([^}]+)\}/);
    let text = b.replace(/<[^>]*>/g, '').trim().replace(/\n/g, ' ');
    if(text.length > 50) text = text.substring(0, 50) + '...';
    console.log('Button: ' + text + ' | Handler: ' + (onClick ? onClick[1].trim() : 'NONE'));
  });
  links.forEach(l => {
    let to = l.match(/to=[\"\'{]([^\"\'}]+)[\"\'}]/);
    let text = l.replace(/<[^>]*>/g, '').trim().replace(/\n/g, ' ');
    if(text.length > 50) text = text.substring(0, 50) + '...';
    console.log('Link: ' + text + ' | To: ' + (to ? to[1] : 'NONE'));
  });
}
