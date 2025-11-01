const isBrowser = () => typeof window !== "undefined";

export type BroadcastPayload = {
  channel: string;
  action: string;
  data?: unknown;
};

export class BroadcastManager {
  private channel?: BroadcastChannel;

  constructor(private readonly name: string) {
    if (isBrowser() && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(name);
    }
  }

  subscribe(listener: (payload: BroadcastPayload) => void) {
    if (!this.channel) return () => undefined;
    const handler = (event: MessageEvent<BroadcastPayload>) => {
      listener(event.data);
    };
    this.channel.addEventListener("message", handler);
    return () => this.channel?.removeEventListener("message", handler);
  }

  publish(action: string, data?: unknown) {
    if (!this.channel) return;
    this.channel.postMessage({ channel: this.name, action, data });
  }

  dispose() {
    this.channel?.close();
  }
}

export const broadcastChange = (name: string, action: string, data?: unknown) => {
  if (!isBrowser() || !("BroadcastChannel" in window)) return;
  const channel = new BroadcastChannel(name);
  channel.postMessage({ channel: name, action, data } satisfies BroadcastPayload);
  channel.close();
};
