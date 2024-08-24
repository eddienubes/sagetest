import { HttpStatusText } from './constants.js';
import { CookieOptions } from './types.js';

export interface SageHttpResponse<T = any> {
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
}

export type SageResponseHeaders = Record<string, string | string[]>;
