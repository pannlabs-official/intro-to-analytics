const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f === 'build-course.js');

let replacedCount = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  const content = fs.readFileSync(fp, 'utf8');
  if (content.includes('—')) {
    const newContent = content.replace(/—/g, '-');
    fs.writeFileSync(fp, newContent, 'utf8');
    replacedCount++;
  }
});

console.log(`Replaced em-dashes in ${replacedCount} files.`);
