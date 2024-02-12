import { ReadableStream, WritableStream } from 'node:stream/web';
import { Blob } from 'node:buffer';

// For NodeJS 16 support
// Unfortunatelly, NodeJS 16 does not support ReadableStream and WritableStream in global scope
const fills = [ReadableStream, WritableStream, Blob];
for (const fill of fills) {
  const typedFill = fill.name as keyof typeof globalThis;
  if (!globalThis[typedFill]) {
    // @ts-expect-error
    globalThis[typedFill] = require('web-streams-polyfill');
  }
}
