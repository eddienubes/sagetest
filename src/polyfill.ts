import { ReadableStream, WritableStream } from 'node:stream/web';
import { Blob } from 'node:buffer';

// For some reason jest doesn't have web streams
const fills = [ReadableStream, WritableStream, Blob];
for (const fill of fills) {
  const typedFill = fill.name as keyof typeof globalThis;
  if (!globalThis[typedFill]) {
    // @ts-expect-error
    globalThis[typedFill] = fill;
  }
}
