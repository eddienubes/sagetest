import { getExpressApp, getFastifyApp } from './utils.js';
import { request, SageHttpResponse } from '../src/index.js';
import fs from 'node:fs';
import { readdir, unlink } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { describe } from 'vitest';
import { SageAssertException } from '../src/SageAssertException.js';

const expectedExpressResponse = new SageHttpResponse({
  statusCode: 200,
  status: 200,
  statusText: 'OK',
  headers: {
    'x-powered-by': 'Express',
    'content-type': 'application/json; charset=utf-8',
    'content-length': expect.any(String),
    etag: expect.any(String),
    date: expect.any(String),
    connection: 'keep-alive'
  },
  body: {
    reqHeaders: {
      connection: 'keep-alive',
      'content-type': expect.any(String),
      host: expect.stringContaining('localhost'),
      'content-length': expect.any(String)
    },
    message: 'Success!',
    body: {},
    query: {},
    files: {}
  },
  buffer: expect.any(Buffer),
  text: expect.any(String),
  ok: true,
  redirect: false,
  location: undefined,
  error: false,
  cookies: {}
}) as Partial<SageHttpResponse>;

const expectedFastifyResponse = new SageHttpResponse({
  statusCode: 200,
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'content-length': expect.any(String),
    date: expect.any(String),
    connection: 'keep-alive'
  },
  body: {
    reqHeaders: {
      connection: 'keep-alive',
      'content-type': expect.any(String),
      host: expect.stringContaining('localhost'),
      'content-length': expect.any(String)
    },
    message: 'Success!',
    body: {},
    query: {},
    files: [
      {
        encoding: '7bit',
        fieldname: 'picture',
        fieldsCount: 1,
        filename: 'cat.jpg',
        mimetype: 'image/jpeg',
        size: 4877386
      }
    ]
  },
  buffer: expect.any(Buffer),
  text: expect.any(String),
  ok: true,
  redirect: false,
  location: undefined,
  error: false,
  cookies: {}
}) as Partial<SageHttpResponse>;

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

  describe('assert', () => {
    describe('successful assertions', () => {
      it('should assert multiple conditions successfully', async () => {
        try {
          await request(expressApp)
            .get('/download')
            .expect(200)
            .expect('content-type', 'image/jpeg');
        } catch (err) {
          expect(true).toBe(false);
        }
      });
    });

    describe('failing assertions', () => {
      it('should assert status code', async () => {
        try {
          await request(expressApp).get('/download').expect(401);
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeInstanceOf(SageAssertException);
        }
      });

      it('should assert multiple status codes', async () => {
        try {
          await request(expressApp).get('/download').expect([401, 401]);
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeInstanceOf(SageAssertException);
        }
      });

      it('should assert header by string', async () => {
        try {
          await request(expressApp)
            .get('/download')
            .expect('content-type', 'image/png');
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeInstanceOf(SageAssertException);
        }
      });

      it('should assert header by regexp', async () => {
        try {
          await request(expressApp)
            .get('/download')
            .expect('content-type', /png/);
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeInstanceOf(SageAssertException);
        }
      });

      it('should assert header by array', async () => {
        try {
          await request(expressApp)
            .get('/download')
            .expect('content-type', ['whatever', 'image/png']);
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeInstanceOf(SageAssertException);
        }
      });
    });
  });

  describe('close', () => {
    it('should close the server in dedicated mode', async () => {
      const test = request(expressApp, { dedicated: true });
      await test.close();
    });

    it('should throw an error if mode is not set to dedicated', async () => {
      const test = request(expressApp);
      await expect(test.close()).rejects.toThrowError();
    });
  });

  describe('express', () => {
    describe('downloads', () => {
      it('should download and buffer file if sent by the server', async () => {
        const res = await request(expressApp).get('/download');

        // long string comparison breaks the test
        delete expectedFastifyResponse.text;

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: expect.any(Buffer),
          headers: {
            connection: 'keep-alive',
            'content-type': 'image/jpeg',
            date: expect.any(String)
          }
        });
      });
    });

    describe('multipart/form-data', () => {
      it('should strip content-type header', async () => {
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg')
          .set('content-type', 'multipart/form-data; boundary=fail-boundary');

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              ...expectedExpressResponse.body.reqHeaders,
              'content-type': expect.stringContaining('multipart/form-data')
            }
          }
        });
        expect(res.body.reqHeaders['content-type']).not.toContain(
          'fail-boundary'
        );
      });

      it('should work with filename', async () => {
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg');

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
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
          }
        } as SageHttpResponse);
      });

      it('should work with streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', stream);

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
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
          }
        });
      });

      it('should work with blobs', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', blob);

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-length': '4877569',
              'content-type': expect.any(String),
              host: expect.stringContaining('localhost')
            },
            files: {
              picture: [
                {
                  destination: 'test/fixtures/temp',
                  encoding: '7bit',
                  fieldname: 'picture',
                  filename: expect.any(String),
                  mimetype: 'application/octet-stream',
                  originalname: 'blob',
                  path: expect.stringContaining('test/fixtures/temp/'),
                  size: 4877386
                }
              ]
            }
          }
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

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost'),
              'content-type': expect.any(String)
            },
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
          }
        });
      });

      it('should work with options as a string', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg');

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost'),
              'content-type': expect.any(String)
            },
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
          }
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

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            body: {
              array: ['value1', 'value2'],
              array2: ['value3', 'value4'],
              array3: ['value5', 'value6'],
              key: 'value'
            },
            reqHeaders: {
              connection: 'keep-alive',
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost'),
              'content-type': expect.any(String)
            },
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
          }
        });
      });

      it('should work with buffered streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', stream, { buffer: true });

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              'content-length': '4877558'
            },
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
          }
        } as SageHttpResponse);
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

        expect(res).toMatchObject({
          statusCode: 200,
          status: 200,
          statusText: 'OK',
          headers: {
            'x-powered-by': 'Express',
            'content-type': 'application/json; charset=utf-8',
            'content-length': expect.any(String),
            etag: expect.any(String),
            date: expect.any(String),
            connection: 'keep-alive'
          },
          body: {
            reqHeaders: {
              connection: 'keep-alive',
              'content-length': expect.any(String),
              'content-type': 'application/json',
              host: expect.stringContaining('localhost')
            },
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
          text: expect.any(String),
          ok: true,
          redirect: false,
          location: undefined,
          error: false
        });
      });
    });

    describe('redirects', () => {
      it('should properly operate with redirects', async () => {
        const res = await request(expressApp).get('/redirect');

        console.log(res.body.toString('utf-8'));

        expect(res).toMatchObject({
          body: expect.any(Buffer),
          headers: {
            connection: 'keep-alive',
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
          text: 'Moved Permanently. Redirecting to https://www.google.com',
          error: false
        });
      });
    });

    describe('header', () => {
      it('should set and pass a single header', async () => {
        const res = await request(expressApp)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value'
            }
          }
        } as SageHttpResponse);
      });

      it('should set and pass 2 values in a single header', async () => {
        const res = await request(expressApp)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value1')
          .set('x-custom-header', 'custom-value2');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2'
            }
          }
        } as SageHttpResponse);
      });

      it('should set and pass 3 values in a single header', async () => {
        const res = await request(expressApp)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value1')
          .set('x-custom-header', 'custom-value2')
          .set('x-custom-header', 'custom-value3');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2, custom-value3'
            }
          }
        } as SageHttpResponse);
      });

      it('should accept arrays', async () => {
        const res = await request(expressApp)
          .post('/ping-pong')
          .set('x-custom-header', [
            'custom-value1',
            'custom-value2',
            'custom-value3'
          ]);

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2, custom-value3'
            }
          }
        } as SageHttpResponse);
      });

      it('should accept objects', async () => {
        const res = await request(expressApp).post('/ping-pong').set({
          'x-custom-header': 'custom-value1',
          'x-custom-header2': 'custom-value2'
        });

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1',
              'x-custom-header2': 'custom-value2'
            }
          }
        } as SageHttpResponse);
      });
    });

    describe('cookies', () => {
      it('should parse cookies properly for response', async () => {
        const res = await request(expressApp).get('/cookie');

        expect(res).toMatchObject({
          headers: {
            'set-cookie':
              'name=express; Path=/, name=I%20love%20my%20mom!; Path=/; HttpOnly'
          },
          cookies: {
            name: {
              httpOnly: true,
              path: '/',
              value: 'I love my mom!'
            }
          }
        });
      });

      it('should parse cookies properly for request', async () => {
        const res = await request(expressApp)
          .get('/cookie')
          .cookie('name', 'fastify');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              cookie: 'name=fastify'
            }
          },
          cookies: {
            name: {
              httpOnly: true,
              path: '/',
              value: 'I love my mom!'
            }
          }
        });
      });
    });

    describe('auth', () => {
      it('should set basic authorization header', async () => {
        const res = await request(expressApp)
          .get('/cookie')
          .auth('username', 'password');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
            }
          }
        });
      });

      it('should set bearer token', async () => {
        const res = await request(expressApp).get('/cookie').auth('token');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              authorization: 'Bearer token'
            }
          }
        });
      });
    });
  });

  describe('fastify', () => {
    beforeAll(async () => {
      await fastifyApp.ready();
    });

    describe('downloads', () => {
      it('should download and buffer file if sent by the server', async () => {
        const res = await request(fastifyApp.server).get('/download');

        // long string comparison breaks the test
        delete expectedFastifyResponse.text;

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: expect.any(Buffer),
          headers: {
            connection: 'keep-alive',
            'content-type': 'image/jpeg',
            date: expect.any(String)
          }
        });
      });
    });

    describe('multipart/form-data', () => {
      it('should strip content-type header', async () => {
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg')
          .set('content-type', 'multipart/form-data; boundary=fail-boundary');

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              ...expectedFastifyResponse.body.reqHeaders,
              'content-type': expect.stringContaining('multipart/form-data')
            }
          }
        });
        expect(res.body.reqHeaders['content-type']).not.toContain(
          'fail-boundary'
        );
      });

      it('should work with filename', async () => {
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', 'test/fixtures/cat.jpg');

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              ...expectedFastifyResponse.body.reqHeaders,
              'content-type': expect.stringContaining('multipart/form-data')
            }
          }
        });
      });

      it('should work with streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', stream);

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              ...expectedFastifyResponse.body.reqHeaders
            }
          }
        });
      });

      it('should work with blobs', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob);

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-type': expect.any(String),
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost')
            },
            files: [
              {
                encoding: '7bit',
                fieldname: 'picture',
                fieldsCount: 1,
                filename: 'blob',
                mimetype: 'application/octet-stream',
                size: 4877386
              }
            ]
          }
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

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-type': expect.any(String),
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost')
            },
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
          }
        });
      });

      it('should work with options as a string', async () => {
        const blob = await fs.openAsBlob('test/fixtures/cat.jpg');
        const res = await request(fastifyApp.server)
          .post('/upload')
          .attach('picture', blob, 'cat.jpg');

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-type': expect.any(String),
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost')
            },
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
          }
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

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            ...expectedFastifyResponse.body,
            reqHeaders: {
              connection: 'keep-alive',
              'content-type': expect.any(String),
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost')
            },
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
          }
        });
      });

      it('should work with buffered streams', async () => {
        const stream = fs.createReadStream('test/fixtures/cat.jpg');
        const res = await request(expressApp)
          .post('/upload')
          .attach('picture', stream, { buffer: true });

        expect(res).toMatchObject({
          ...expectedExpressResponse,
          body: {
            ...expectedExpressResponse.body,
            reqHeaders: {
              'content-length': '4877558'
            },
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
          }
        } as SageHttpResponse);
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

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: {
            reqHeaders: {
              connection: 'keep-alive',
              'content-type': 'application/json',
              'content-length': expect.any(String),
              host: expect.stringContaining('localhost')
            },
            body: {
              data: 'somevalue',
              nestedObj: {
                nestedKey: 'nestedValue'
              }
            },
            message: 'Success!',
            query: {
              key: 'value'
            }
          }
        });
      });
    });

    describe('redirects', () => {
      it('should properly operate with redirects', async () => {
        const res = await request(fastifyApp.server).get('/redirect');

        expect(res).toMatchObject({
          ...expectedFastifyResponse,
          body: expect.any(Buffer),
          headers: {
            connection: 'keep-alive',
            location: 'https://www.google.com'
          },
          location: 'https://www.google.com',
          redirect: true,
          statusText: 'Moved Permanently',
          status: 301,
          statusCode: 301,
          text: '',
          ok: false
        } as Partial<SageHttpResponse>);
      });
    });

    describe('header', () => {
      it('should set and pass a single header', async () => {
        const res = await request(fastifyApp.server)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value'
            }
          }
        } as SageHttpResponse);
      });

      it('should set and pass 2 values in a single header', async () => {
        const res = await request(fastifyApp.server)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value1')
          .set('x-custom-header', 'custom-value2');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2'
            }
          }
        } as SageHttpResponse);
      });

      it('should set and pass 3 values in a single header', async () => {
        const res = await request(fastifyApp.server)
          .post('/ping-pong')
          .set('x-custom-header', 'custom-value1')
          .set('x-custom-header', 'custom-value2')
          .set('x-custom-header', 'custom-value3');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2, custom-value3'
            }
          }
        } as SageHttpResponse);
      });

      it('should accept array with multiple values', async () => {
        const res = await request(fastifyApp.server)
          .post('/ping-pong')
          .set('x-custom-header', [
            'custom-value1',
            'custom-value2',
            'custom-value3'
          ]);

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1, custom-value2, custom-value3'
            }
          }
        } as SageHttpResponse);
      });

      it('should accept arrays with a single value', async () => {
        const res = await request(fastifyApp.server)
          .post('/ping-pong')
          .set('x-custom-header', ['custom-value1']);

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1'
            }
          }
        } as SageHttpResponse);
      });

      it('should accept objects', async () => {
        const res = await request(expressApp).post('/ping-pong').set({
          'x-custom-header': 'custom-value1',
          'x-custom-header2': 'custom-value2'
        });

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              'x-custom-header': 'custom-value1',
              'x-custom-header2': 'custom-value2'
            }
          }
        } as SageHttpResponse);
      });
    });

    describe('cookies', () => {
      it('should parse cookies properly for response', async () => {
        const res = await request(fastifyApp.server).get('/cookie');

        expect(res).toMatchObject({
          headers: {
            'set-cookie':
              'name=fastify; SameSite=Lax, love=my%20mom!; HttpOnly; SameSite=Lax'
          },
          cookies: {
            love: {
              httpOnly: true,
              path: '/',
              value: 'my mom!'
            }
          }
        });
      });

      it('should parse cookies properly for request', async () => {
        const res = await request(fastifyApp.server)
          .get('/cookie')
          .cookie('name', 'fastify');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              cookie: 'name=fastify'
            }
          },
          cookies: {
            love: {
              httpOnly: true,
              path: '/',
              value: 'my mom!'
            }
          }
        });
      });
    });

    describe('auth', () => {
      it('should basic authorization header', async () => {
        const res = await request(fastifyApp.server)
          .get('/cookie')
          .auth('username', 'password');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
            }
          }
        });
      });

      it('should set bearer token', async () => {
        const res = await request(fastifyApp.server)
          .get('/cookie')
          .auth('token');

        expect(res).toMatchObject({
          body: {
            reqHeaders: {
              authorization: 'Bearer token'
            }
          }
        });
      });
    });
  });
});
