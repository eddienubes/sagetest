import { HttpStatusText } from './constants.js';
import { CookieOptions } from './types.js';

export interface SageHttpResponse {
  /**
   * Beware that body could be null if server has redirected etc.
   */
  body: any;
  /**
   * Text representation of the body
   */
  text: string;
  statusCode: number;
  /**
   * Alias of statusCode
   */
  status: number;
  /**
   * The mapping of status codes to status messages as defined in the HTTP/1.1 specification
   */
  statusText: HttpStatusText;
  headers: Record<string, string | string[] | undefined>;

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
