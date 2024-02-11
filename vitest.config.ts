import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
    disableConsoleIntercept: true,
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.spec.ts', 'examples/**/*.spec.ts'],
  }
});
