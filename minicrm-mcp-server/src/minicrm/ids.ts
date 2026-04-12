/**
 * Path segments for Contact / Project / ToDoList use numeric ids; strip noise from LLM input.
 */
export function coerceRecordId(id: string | number): string {
  const s = String(id);
  const digits = s.replace(/\D/g, "");
  return digits.length > 0 ? digits : s;
}
