import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.spec.ts', 'examples/**/*.spec.ts'],
    coverage: {
      exclude: ['docs/**/*']
    }
  }
});
