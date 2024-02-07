import { getExpressApp } from './utils.js';
import { request } from '../src/index.js';
import { expect } from 'vitest';

const app = getExpressApp();

describe('request', () => {
  describe('POST', () => {
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

    it('should handle multipart/form-data uploads', async () => {
      const res = await request(app)
        .post('/upload')
        .attach('picture', Buffer.from('test'));

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
          query: {}
        },
        text: '{"message":"Success!","body":{},"query":{}}',
        ok: true,
        redirect: false,
        location: undefined
      });
    });
  });

  describe('GET', () => {
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
