const fs = require('fs');
const path = require('path');
const https = require('https');

const jsDir = path.join(__dirname, 'assets', 'js');
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

const deps = [
  {
    url: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js',
    dest: 'mermaid.min.js'
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    dest: 'supabase.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    dest: 'html2canvas.min.js'
  }
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        download(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${url} -> ${destPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const dep of deps) {
    try {
      await download(dep.url, path.join(jsDir, dep.dest));
    } catch (e) {
      console.error(`Error downloading ${dep.url}:`, e.message);
    }
  }
}

run();
