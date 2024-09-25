import esbuild from 'rollup-plugin-esbuild';
import { defineConfig } from 'rollup';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';

export default defineConfig({
  input: 'src/index.ts',

  plugins: [
    esbuild(),
    // @ts-expect-error bullshit export types
    tsConfigPaths()
  ],
  output: [
    {
      dir: 'build',
      preserveModules: true,
      format: 'cjs',
      sourcemap: false,
      entryFileNames: '[name].js'
    },
    {
      dir: 'build',
      preserveModules: true,
      format: 'es',
      sourcemap: false,
      entryFileNames: '[name].mjs'
    }
  ]
});
