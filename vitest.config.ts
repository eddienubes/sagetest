import { defineConfig } from 'vitest/config';

export default defineConfig({
  mode: 'benchmark',
  test: {
    globals: true
  }
});
