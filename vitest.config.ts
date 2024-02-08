import { defineConfig } from 'vitest/config';

export default defineConfig({
  // mode: 'benchmark',
  test: {
    globals: true,
    reporters: ['verbose'],
    disableConsoleIntercept: true,
    testTimeout: 1000000
  }
});
