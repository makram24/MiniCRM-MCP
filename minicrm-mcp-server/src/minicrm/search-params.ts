/**
 * Build query string for miniCRM GET endpoints (Track B — unit tested).
 */
export function buildSearchParamsString(
  params: Record<string, string | undefined>
): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    u.set(k, v);
  }
  return u.toString();
}
