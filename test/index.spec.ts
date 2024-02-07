import { getExpressApp } from './utils.js';
import { request } from '../src/index.js';
import { expect } from 'vitest';

const app = getExpressApp();

describe('request', () => {
  it('should properly call sage assistant and respond', async () => {
    const res = await request(app)
      .post('/api')
      .query({
        key: 'value'
      })
      .send({
        data: 'somevalue',
        nestedObj: {
          nestedKey: 'nestedValue'
        }
      });

    expect(res.body).toEqual({
      statusCode: 200,
      status: 200,
      statusText: 'OK',
      headers: {
        'x-powered-by': 'Express',
        'content-type': 'application/json; charset=utf-8',
        'content-length': '68',
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
      text: '{"message":"Success!","data":{"somedata":"somevalue","obj":{"a":1}}}',
      ok: true,
      redirect: false
    });
  });
});
