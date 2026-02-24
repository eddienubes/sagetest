export class SageAssertException extends Error {
  constructor(message: string, expectedStacktrace: string) {
    super(message);
    this.name = SageAssertException.name;

    const stack = this.stack?.split('\n') as string[];

    this.stack = [`${expectedStacktrace}\n`, ...stack.slice(1)].join('\n');
  }
}
