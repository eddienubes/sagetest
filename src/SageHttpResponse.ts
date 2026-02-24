import { CookieOptions, ResponseHeader, SageResponseHeaders } from './types.js';
import { IncomingHttpHeaders } from 'undici/types/header.js';
import { HttpStatusText } from './constants.js';

export interface SageHttpResponseProps {
  headers: IncomingHttpHeaders;
}

export class SageHttpResponse<T = any> {
  /**
   * Beware that body will fall back to buffer if the response is a file or server has redirected the request.
   * For file downloads, use the `buffer` field instead.
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
   * If header is present multiple times, the values are joined with a comma.
   * It's done for the sake of testing simplicity.
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

  constructor(
    props: Partial<Omit<SageHttpResponse<T>, 'get' | 'headers' | 'wrapHeaders'>> &
      SageHttpResponseProps
  ) {
    Object.assign(this, {
      ...props,
      headers: this.wrapHeaders(props.headers)
    });
  }

  /**
   * Get the value of the header field.
   * Multiple headers are joined with a comma.
   * If the header is not present, it will return null.
   * @param header
   */
  get(header: ResponseHeader): string | null {
    header = header.toLowerCase();
    const value = this.headers[header];

    if (value === undefined) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value;
  }

  private wrapHeaders(headers: IncomingHttpHeaders): SageResponseHeaders {
    const wrapped: SageResponseHeaders = {};

    for (const [key, value] of Object.entries(headers)) {
      if (value === undefined) {
        wrapped[key] = undefined;
        continue;
      }

      wrapped[key] = Array.isArray(value) ? value.join(', ') : value;
    }

    return wrapped;
  }
}
