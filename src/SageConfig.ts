export interface SageConfig {
  /**
   * Launch a dedicated server which will be preserved between requests.
   * When you call request(), it will spin up a new server for you.
   * This server will persist throughout testing, so you'll have to shut down it manually via shutdown().
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
}
