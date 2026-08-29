import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import * as wasmModule from 'vite-plugin-wasm'

const __dirname = dirname(fileURLToPath(import.meta.url))

// vite-plugin-wasm ships dual CJS/ESM; under module:nodenext tsc resolves the
// `require` types (export = namespace), so unwrap `.default` explicitly.
const wasm = (wasmModule as unknown as { default: () => Plugin }).default

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      // The Midnight indexer data provider imports `ws` (mapped by its browser
      // field to `isomorphic-ws`); those browser builds don't export WebSocket.
      // Route both to the browser's native global.
      ws: resolve(__dirname, 'src/lib/ws-shim.ts'),
      'isomorphic-ws': resolve(__dirname, 'src/lib/ws-shim.ts'),
    },
  },
  assetsInclude: ['**/*.prover', '**/*.verifier', '**/*.zkir', '**/*.bzkir'],
})