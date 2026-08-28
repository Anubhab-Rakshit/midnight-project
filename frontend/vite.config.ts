import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
