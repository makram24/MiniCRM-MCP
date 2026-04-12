/**
 * `projekt_statusz_valtas` must send only { StatusId } — value type matches API expectations where possible.
 */
export function normalizeStatusIdForBody(
  statusz_id: number | string
): number | string {
  if (typeof statusz_id === "number") return statusz_id;
  const n = Number(statusz_id);
  return Number.isFinite(n) ? n : statusz_id;
}
