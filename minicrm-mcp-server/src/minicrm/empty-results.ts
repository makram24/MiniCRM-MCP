/**
 * Phase 2 — Phase-02 Step 7.f: explicit empty list hint for Claude.
 */

export function appendEmptyListNote(body: unknown): string {
  if (body === null || typeof body !== "object") return "";
  const o = body as Record<string, unknown>;
  if ("Count" in o && o.Count === 0) {
    return "\n\n[Nincs találat a megadott szűrőknek megfelelően.]";
  }
  if ("Results" in o && o.Results !== undefined) {
    const r = o.Results;
    if (Array.isArray(r) && r.length === 0) {
      return "\n\n[Nincs találat a megadott szűrőknek megfelelően.]";
    }
    if (
      r !== null &&
      typeof r === "object" &&
      !Array.isArray(r) &&
      Object.keys(r as object).length === 0
    ) {
      return "\n\n[Nincs találat a megadott szűrőknek megfelelően.]";
    }
  }
  return "";
}
