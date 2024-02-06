import { RequestListener, Server as HttpServer } from 'node:http';

/**
 * RequestListener and Server are both acceptable because Server implements ServerOptions interface
 */
export type SageServer = HttpServer | RequestListener;
