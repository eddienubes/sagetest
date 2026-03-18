import cronometro from 'cronometro';
import { fileUploadBufferTests } from './suites/file-upload-buffer.ts';
import { fileUploadStreamTests } from './suites/file-upload-stream.ts';
import { jsonBodyTests } from './suites/json-body.ts';

await cronometro(
  {
    ...fileUploadBufferTests,
    ...fileUploadStreamTests,
    ...jsonBodyTests
  },
  {
    iterations: 10000,
    warmup: true,
    print: { compare: true }
  }
);
