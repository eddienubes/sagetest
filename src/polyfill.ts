import { ReadableStream, WritableStream } from 'node:stream/web';

// For NodeJS 16 support
// Unfortunatelly, NodeJS 16 does not support ReadableStream and WritableStream in global scope
// @ts-expect-error
globalThis.ReadableStream = ReadableStream;
// @ts-expect-error
globalThis.WritableStream = WritableStream;
