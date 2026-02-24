export interface SageConfig {
  /**
   * Launch a dedicated server which will be preserved between requests.
   * When you call request(), it will spin up a new server for you.
   * This server will persist throughout testing, so you'll have to shut it down manually via close().
   * When this option is set to false, sagetest mimics supertest behaviour and spins up a new server for each request,
   * as well as handles its graceful shutdown.
   * @default false
   */
  dedicated: boolean;

  /**
   * Port for the dedicated server.
   * No idea why would anyone want to use this. It's better to use ephemeral ports to avoid conflicts.
   * @default 0, which means an ephemeral port
   */
  port: number;

  /**
   * Whether to establish a keep-alive connection to the server.
   * @default true
   */
  keepAlive: boolean;

  /**
   * Base URL for the server.
   * Prefix for all requests.
   * Useful for common API paths like /api/v1.
   * Please also remember that all HTTP paths have to start with a slash.
   * E.g. your request URL may be /users/:userId and the base URL is /api/v1, so the final URL will be /api/v1/users/:userId.
   * @default null
   */
  baseUrl: string | null;
}
