export interface WebSocketLike {
  new (url: string, protocols?: string | string[]): WebSocketLike;
  readonly readyState: number;
  readonly url: string;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
  onopen: ((ev: Event) => any) | null;
  onmessage: ((ev: MessageEvent) => any) | null;
  onclose: ((ev: CloseEvent) => any) | null;
  onerror: ((ev: Event) => any) | null;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
}
