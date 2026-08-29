import { Buffer } from 'buffer'

// The Midnight SDK bundles (ledger-v8, midnight-js-utils, bech32m decoder)
// call the Node.js `Buffer` global at runtime. Browsers don't have it, so
// install the `buffer` polyfill on the global before the app code runs.
const g = globalThis as unknown as Record<string, unknown>
g.Buffer = Buffer as unknown as typeof Buffer
g.global = g
g.process = g.process ?? ({ env: {} } as unknown)