import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const markdown = ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'SUPPORT.md', 'CODE_OF_CONDUCT.md', 'CHANGELOG.md', 'docs/DEPLOY.md', 'docs/OPERATIONS.md', 'docs/media/README.md'];
let links = 0;
for (const file of markdown) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    const local = decodeURIComponent(target.split(/[?#]/)[0]);
    if (!fs.existsSync(path.resolve(root, path.dirname(file), local))) {
      throw new Error(`${file}: missing local link ${target}`);
    }
    links++;
  }
}
const media = path.join(root, 'docs/media');
const metadata = JSON.parse(fs.readFileSync(path.join(media, 'demo-metadata.json'), 'utf8'));
for (const [file, expected] of [[metadata.source, metadata.sourceSha256], [metadata.video, metadata.videoSha256]]) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(media, file))).digest('hex');
  if (actual !== expected) throw new Error(`Demo checksum mismatch: ${file}`);
}
console.log(`Checked ${markdown.length} documents, ${links} local links, and both demo checksums.`);
