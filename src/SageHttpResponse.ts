import { HttpStatusText } from './constants.js';
import { CookieOptions } from './types.js';
import { wrapArray } from './utils.js';

export class SageHttpResponse<T = any> {
  /**
   * Beware that body will fall back to buffer if the response is a file or server has redirected the request.
   * If you want to stream the file, the response promise implements NodeJS Readable, just don't await it.
   * The type includes "any" to ease the migration from supertest.
   * If you stand against it, please open an issue here https://github.com/eddienubes/sagetest
   */
  body: T;

  /**
   * Text representation of the body.
   * Be careful, sometimes buffer-string to string comparison is slow or unreliable in tests (jest/vitest)
   */
  text: string;
  /**
   * Buffer representation of the body. Useful for file downloads.
   */
  buffer: Buffer;

  statusCode: number;
  /**
   * Alias of statusCode
   */
  status: number;
  /**
   * The mapping of status codes to status messages as defined in the HTTP/1.1 specification
   */
  statusText: HttpStatusText;

  /**
   * Contains the response headers.
   * If the header is not present, it will be undefined.
   * If the header is present multiple times (e.g. Set-Cookie is a popular case), the values are returned as an array.
   */
  headers: SageResponseHeaders;

  /**
   * True if the status code falls in the range 200-299
   */
  ok: boolean;

  /**
   * True if the status code is 301, 302, 303, 307, or 308
   */
  redirect: boolean;

  /**
   * True if the status code is 400 or higher
   */
  error: boolean;

  /**
   * Location header. Defined only if redirect is true
   */
  location?: string;

  /**
   * Cookies sent by the server. Also, accessible from headers['set-cookie']
   */
  cookies: Record<string, CookieOptions>;

  constructor(props: Omit<SageHttpResponse, 'get'>) {
    Object.assign(this, props);
  }

  /**
   * Get the value of the header field.
   * If the header is not present, undefined is returned.
   * If the header is present multiple times, the values are joined with a comma.
   * To get raw headers, use this.headers map.
   * @param header
   */
  get(header: 'Set-Cookie'): string[] | null;
  get(header: string): string | null;
  get(header: string | 'Set-Cookie'): string | string[] | null {
    header = header.toLowerCase();
    const value = this.headers[header];

    if (value === undefined) {
      return null;
    }

    if (header === 'set-cookie') {
      return wrapArray(value);
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value;
  }
}

export type SageResponseHeaders = Record<string, string | string[] | undefined>;
