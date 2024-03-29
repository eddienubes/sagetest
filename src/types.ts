import { RequestListener, Server as HttpServer } from 'node:http';
import { HTTP_METHODS } from './constants.js';
import { Dispatcher } from 'undici';

export type ServerSource = HttpServer | RequestListener;
/**
 * RequestListener and Server are both acceptable because Server implements ServerOptions interface
 */
export type SageServer = {
  server: HttpServer;
  /**
   * Returns a promise that resolves when server is ready to accept connections
   */
  listenResolver: ServerListenResolver;
  launched: boolean;
};
export type ServerListenResolver = () => Promise<void>;
export type RequestLineSetter<T> = (path: string) => T;
export type HttpCallable<T> = {
  [K in (typeof HTTP_METHODS)[number]]: RequestLineSetter<T>;
} & ServerShutdownCapable;
export type HttpMethod = Dispatcher.HttpMethod;
export type ServerShutdownCapable = {
  /**
   * Shutdowns
   */
  shutdown: () => Promise<void>;
};

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
