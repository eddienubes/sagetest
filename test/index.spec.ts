import { getExpressApp, getFastifyApp } from './utils.js';
import { request } from '../src/index.js';
import fs from 'node:fs';
import { readdir, unlink } from 'node:fs/promises';

describe('request', () => {
  afterAll(async () => {
    const files = await readdir('test/fixtures/temp');

    for (const file of files) {
      if (file === '.gitkeep') {
        continue;
      }
      await unlink(`test/fixtures/temp/${file}`);
    }
  });

  const expressApp = getExpressApp();
  const fastifyApp = getFastifyApp();

  describe('express', () => {
    describe('multipart/form-data', () => {
      it('should work with filename', async () => {
        const res = await request(expressApp)
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
            connection: 'close'
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
        const res = await request(expressApp)
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
            connection: 'close'
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
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', blob);

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
            connection: 'close'
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
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', blob, {
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
            connection: 'close'
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
        const res = await request(expressApp)
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
            connection: 'close'
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
      it('should work with mixed multipart/form-data', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg')
          .field('key', 'value')
          .field('array', ['value1', 'value2'])
          .field('array2[]', 'value3')
          .field('array2[]', 'value4')
          .field('array3', 'value5')
          .field('array3', 'value6');

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
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {
              array: ['value1', 'value2'],
              array2: ['value3', 'value4'],
              array3: ['value5', 'value6'],
              key: 'value'
            },
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
    describe('application/json', () => {
      it('should properly call sage assistant and respond in expected format', async () => {
        const res = await request(expressApp)
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
            connection: 'close'
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
        const res = await request(expressApp).get('/redirect');

        expect(res).toEqual({
          body: null,
          headers: {
            connection: 'close',
            date: expect.any(String),
            'content-length': expect.any(String),
            'content-type': 'text/plain; charset=utf-8',
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

  describe('fastify', () => {
    beforeAll(async () => {
      await fastifyApp.ready();
    });

    describe('multipart/form-data', () => {
      it('should work with filename', async () => {
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg');

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                filename: 'cat.jpg',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', stream);

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                filename: 'cat.jpg',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with blobs', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob);

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                filename: 'undefined',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with options object', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob, {
            filename: 'cat.jpg',
            type: 'image/jpeg'
          });

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                filename: 'cat.jpg',
                mimetype: 'image/jpeg',
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with options as a string', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg');

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                filename: 'cat.jpg',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });

      it('should work with mixed multipart/form-data', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg')
          .field('key', 'value')
          .field('array', ['value1', 'value2'])
          .field('array2[]', 'value3')
          .field('array2[]', 'value4')
          .field('array3', 'value5')
          .field('array3', 'value6');

        expect(res).toEqual({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
          },
          body: {
            message: 'Success!',
            body: {},
            query: {},
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 5,
                filename: 'cat.jpg',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          },
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined
        });
      });
    });

    describe('application/json', () => {
      it('should properly call sage assistant and respond in expected format', async () => {
        const res = await request(fastifyApp.server)
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
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            date: expect.any(String),
            connection: 'close'
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
        const res = await request(fastifyApp.server).get('/redirect');

        expect(res).toEqual({
          body: null,
          headers: {
            connection: 'close',
            date: expect.any(String),
            'content-length': expect.any(String),
            location: 'https://www.google.com'
          },
          location: 'https://www.google.com',
          ok: false,
          redirect: true,
          status: 301,
          statusCode: 301,
          statusText: 'Moved Permanently',
          text: ''
        });
      });
    });
  });
});
