/**
 * Phase 2 — Phase-02 Step 5: stderr only; no secrets, no full bodies.
 */

export type ToolLogLine = {
  ts: string;
  reqId: string;
  tool: string;
  ms: number;
  status: number;
  path: string;
};

export function shouldLogToolInvocation(useMock: boolean): boolean {
  if (process.env.MINICRM_LOG_TOOLS === "0") return false;
  if (process.env.MINICRM_LOG_TOOLS === "1") return true;
  return !useMock;
}

export function logToolInvocation(line: ToolLogLine): void {
  console.error(JSON.stringify(line));
}
