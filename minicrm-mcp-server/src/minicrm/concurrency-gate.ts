/**
 * Phase 2 — Phase-02 Step 4.5: cap parallel outbound HTTPS calls.
 */

export class ConcurrencyGate {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly max: number) {
    if (max < 1) throw new Error("ConcurrencyGate: max must be >= 1");
  }

  async acquire(): Promise<void> {
    if (this.active < this.max) {
      this.active++;
      return;
    }
    await new Promise<void>((resolve) => {
      this.waiters.push(() => {
        this.active++;
        resolve();
      });
    });
  }

  release(): void {
    this.active--;
    const next = this.waiters.shift();
    if (next) next();
  }
}
