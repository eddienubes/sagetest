import '../src/polyfill.js';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { compare } from 'compare-versions';
import { Blob } from 'node:buffer';

const version = process.version;

// https://nodejs.org/api/fs.html#fsopenasblobpath-options
if (!compare(version.replace('v', ''), '19.8.0', '>')) {
  // @ts-expect-error
  fs.openAsBlob = async (filePath: string): Blob => {
    const readable = fs.createReadStream(filePath);

    const stream = await readable.toArray();
    const blob = new Blob(stream);

    return blob;
  };
}
