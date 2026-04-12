/**
 * Sliding window: at most `maxPerMinute` calls per rolling 60s (scope: 60 req/min).
 */
export class RateLimiter {
  private readonly timestamps: number[] = [];

  constructor(private readonly maxPerMinute: number) {}

  async acquire(): Promise<void> {
    const now = Date.now();
    const windowMs = 60_000;
    while (this.timestamps.length > 0 && now - this.timestamps[0]! >= windowMs) {
      this.timestamps.shift();
    }
    if (this.timestamps.length < this.maxPerMinute) {
      this.timestamps.push(Date.now());
      return;
    }
    const wait = windowMs - (now - this.timestamps[0]!) + 15;
    await new Promise((r) => setTimeout(r, Math.max(wait, 0)));
    return this.acquire();
  }
}
