import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/sandbox-entry.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  target: 'esnext',
  sourcemap: false,
  minify: false,
  deps: {
    neverBundle: ['cloudflare:sockets'],
  },
  outExtensions: () => ({ js: '.mjs' }),
})
