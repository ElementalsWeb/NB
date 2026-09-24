const fs = require('node:fs');
const path = require('node:path');

// treble-scripts 0.0.44 copies only favicon.ico from public during builds.
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.copyFileSync(
  path.join(root, 'public', 'sw.js'),
  path.join(root, 'build', 'sw.js')
);
