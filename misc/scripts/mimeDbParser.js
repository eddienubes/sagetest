import db from 'mime-db';
import fs from 'node:fs/promises';

const obj = {};

for (const type in db) {
  const mime = db[type];
  if (mime.extensions) {
    for (const ext of mime.extensions) {
      obj[ext] = type;
    }
  }
}

await fs.writeFile('mimeDb.json', JSON.stringify(obj, null, 2));
