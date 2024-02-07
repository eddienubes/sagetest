import util from 'util';

export class SageException extends Error {
  constructor(
    message: string,
    public readonly upstream?: unknown
  ) {
    super(`${message}${upstream ? `\n${util.inspect(upstream)}` : ''}`);
  }
}
