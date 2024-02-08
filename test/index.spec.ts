import { getExpressApp } from './utils.js';
import { request } from '../src/index.js';
import { expect } from 'vitest';
import fs from 'fs';

const app = getExpressApp();

describe('request', () => {
  describe('express', () => {
    describe('multipart/form-data uploads', () => {
      it('should work with filename', async () => {
        const res = await request(app)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg');

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'application/octet-stream',
                  originalname: 'cat.jpg',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });
      it('should work with streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(app)
          .post('/upload')
          .attach('picture', stream);

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'application/octet-stream',
                  originalname: 'cat.jpg',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });
      it('should work with blobs', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(app).post('/upload').attach('picture', blob);

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'application/octet-stream',
                  originalname: 'undefined',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });
      it('should work with options object', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(app).post('/upload').attach('picture', blob, {
          filename: 'cat.jpg',
          type: 'image/jpeg'
        });

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'image/jpeg',
                  originalname: 'cat.jpg',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with options as a string', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(app)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg');

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'application/octet-stream',
                  originalname: 'cat.jpg',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });
    });

    describe('application/json requests', () => {
      it('should properly call sage assistant and respond in expected format', async () => {
        const res = await request(app)
          .post('/ping-pong')
          .query({
            key: 'value'
          })
          .send({
            data: 'somevalue',
            nestedObj: {
              nestedKey: 'nestedValue'
            }
          });

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive',
            'keep-alive': 'timeout=5'
          },
          body: {
            message: 'Success!',
            body: {
              data: 'somevalue',
              nestedObj: {
                nestedKey: 'nestedValue'
              }
            },
            query: {
              key: 'value'
            }
          },
          text: `{"message":"Success!","body":{"data":"somevalue","nestedObj":{"nestedKey":"nestedValue"}},"query":{"key":"value"}}`,
          ok: true,
          redirect: false,
          location: undefined
        });
      });
    });
    describe('redirects', () => {
      it('should properly operate with redirects', async () => {
        const res = await request(app).get('/redirect');

        expect(res).toEqual({
          body: null,
          headers: {
            connection: 'keep-alive',
            date: expect.any(String),
            'content-length': expect.any(String),
            'content-type': 'text/plain; charset=utf-8',
            'keep-alive': 'timeout=5',
            location: 'https://www.google.com',
            vary: 'Accept',
            'x-powered-by': 'Express'
          },
          location: 'https://www.google.com',
          ok: false,
          redirect: true,
          status: 301,
          statusCode: 301,
          statusText: 'Moved Permanently',
          text: 'Moved Permanently. Redirecting to https://www.google.com'
        });
      });
    });
  });

  describe('fastify', () => {});
});
