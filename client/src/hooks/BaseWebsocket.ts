type Fn = (e: MessageEvent) => void;

const url = "ws://localhost:5000";
export class BaseWebsocket {
  private socket: WebSocket | null;
  private subscriptions: Set<Fn>;

  constructor(url: string) {
    this.socket = null;
    this.subscriptions = new Set();
    this.init(url);
  }

  private init(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("opening...");
    };

    this.socket.onerror = (error) => {
      console.log("WebSocket error " + error);
    };

    this.socket.onclose = (e) => {
      if (e.code === 1005) {
        console.log("closing...");
      } else {
        console.log(
          "Socket is closed Unexpectedly. Reconnect will be attempted in 4 second.",
          e.reason
        );
        setTimeout(() => {
          this.init(url);
        }, 4000);
      }
    };

    this.socket.onmessage = (e: MessageEvent) => {
      this.subscriptions.forEach((sub) => {
        sub(e);
      });
    };
  }

  subscribe(fn: Fn) {
    this.subscriptions.add(fn);
    return () => {
      if (this.subscriptions.has(fn)) {
        this.subscriptions.delete(fn);
      }
    };
  }

  close() {
    this.socket?.close?.();
  }

  send(data: string) {
    this.socket?.send?.(data);
  }
}

export const baseWebsocket = new BaseWebsocket(url);
