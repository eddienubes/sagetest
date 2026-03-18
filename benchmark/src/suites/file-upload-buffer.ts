import { readFileSync } from 'node:fs';
import path from 'node:path';
import { request } from 'sagetest';
import supertest from 'supertest';
import { createApp } from '../server.ts';

const app = createApp();
const fixturePath = path.resolve(
  import.meta.dirname,
  '../../../test/fixtures/cat.jpg'
);
const buffer = readFileSync(fixturePath);

export const fileUploadBufferTests = {
  supertest: async () => {
    await supertest(app)
      .post('/upload')
      .attach('picture', buffer, 'cat.jpg')
      .expect(200);
  },
  sagetest: async () => {
    await request(app)
      .post('/upload')
      .attach('picture', buffer, { filename: 'cat.jpg', type: 'image/jpeg' })
      .expect(200);
  }
};
