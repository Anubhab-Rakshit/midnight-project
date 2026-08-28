/**
 * Browser WebSocket shim for the Midnight SDK's indexer data provider.
 * The `isomorphic-ws` browser build doesn't export a WebSocket; browsers
 * provide a native global instead.
 */

import type { WebSocketLike } from '../types/websocket';

const native = (typeof globalThis !== 'undefined' && (globalThis as any).WebSocket) as
  | WebSocketLike
  | undefined;

export default native ?? (undefined as unknown as WebSocketLike);
export const WebSocket = native ?? (undefined as unknown as WebSocketLike);
