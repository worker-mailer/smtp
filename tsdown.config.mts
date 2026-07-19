import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/queue.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
  minify: true,
  clean: true,
  deps: {
    neverBundle: ['cloudflare:sockets'],
    skipNodeModulesBundle: true,
  },
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.js',
    dts: '.d.ts',
  }),
})
