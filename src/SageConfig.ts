export interface SageConfig {
  /**
   * Launch a dedicated server for each HTTP .method() call. E.g. request(app).get('/'), where .get() is a method.
   * By default, Sage uses a predefined server listening to an ephemeral port.
   * This server is created within the first request(app) call.
   * @default false
   */
  dedicated: boolean;

  /**
   * Port for the dedicated server.
   * No idea why would anyone want to use this. It's better to use ephemeral ports to avoid conflicts.
   * @default 0, which means an ephemeral port
   */
  port: number;
}
