import { RequestListener, Server as HttpServer } from 'node:http';
import { Dispatcher } from 'undici';

/**
 * RequestListener and Server are both acceptable because Server implements ServerOptions interface
 */
export type ServerSource = HttpServer | RequestListener;
export type HttpMethod = Dispatcher.HttpMethod;

export type ThenableResolve<T> = (value: T) => void;
export type ThenableReject = (reason?: unknown) => void;
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// Credits to https://github.com/expressjs/express
export type CookieOptions = {
  /**
   * The underlying value of the cookie.
   */
  value: string;
  /** Convenient option for setting the expiry time relative to the current time in **milliseconds**. */
  maxAge?: number;
  /** Indicates if the cookie should be signed. */
  signed?: boolean;
  /** Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie. */
  expires?: Date;
  /** Flags the cookie to be accessible only by the web server. */
  httpOnly?: boolean;
  /** Path for the cookie. Defaults to “/”. */
  path?: string;
  /** Domain name for the cookie. Defaults to the domain name of the app. */
  domain?: string;
  /** Marks the cookie to be used with HTTPS only. */
  secure?: boolean;
  /**
   * Value of the “SameSite” Set-Cookie attribute.
   * @link https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.
   */
  sameSite?: CookieSameSiteProperty;

  /** https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#partitioned */
  partitioned?: boolean;
};
export type CookieSameSiteProperty = boolean | 'lax' | 'strict' | 'none';
export type CookiePriorityProperty = 'low' | 'medium' | 'high';
export type SetCookieHeaderProperties =
  | 'Domain'
  | 'Expires'
  | 'HttpOnly'
  | 'Max-Age'
  | 'Partitioned'
  | 'Path'
  | 'SameSite'
  | 'Secure';

export type SageAssert = StatusCodeAssert | StatusCodeArrAssert | HeaderAssert;

export type StatusCodeAssert = {
  type: 'status-code';
  expected: number;
  fn: (actual?: number) => void;
};

export type StatusCodeArrAssert = {
  type: 'status-code-arr';
  expected: number[];
  fn: (actual?: number) => void;
};

export type HeaderAssert = {
  type: 'header';
  header: string;
  expected: string | string[] | RegExp;
  fn: (actual?: string | string[] | null) => void;
};
