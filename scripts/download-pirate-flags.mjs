import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { createWriteStream } from 'fs';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const crews = JSON.parse(readFileSync(join(root, 'src/data/pirate-crews.json'), 'utf8'));
const outDir = join(root, 'public/images/pirate-crews');
mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

const updated = [];
for (const crew of crews) {
  const localPath = `/images/pirate-crews/${crew.code}.png`;
  const dest = join(outDir, `${crew.code}.png`);
  process.stdout.write(`Downloading ${crew.name}... `);
  try {
    await download(crew.imageUrl, dest);
    console.log('ok');
    updated.push({ ...crew, imageUrl: localPath });
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    updated.push(crew);
  }
}

writeFileSync(join(root, 'src/data/pirate-crews.json'), JSON.stringify(updated, null, 2) + '\n');
console.log('\nDone. pirate-crews.json updated with local paths.');
