/**
 * Phase 2 — Hungarian user-facing HTTP errors (Phase-02 Step 3.4).
 */

export function hungarianMessageForHttpStatus(status: number): string {
  switch (status) {
    case 400:
      return "Hibás kérés — ellenőrizd a megadott mezőket vagy azonosítókat.";
    case 401:
      return "Sikertelen hitelesítés — a SystemId vagy a REST API kulcs nem megfelelő.";
    case 403:
      return "Nincs jogosultság ehhez a művelethez.";
    case 404:
      return "A kért erőforrás nem található.";
    case 405:
      return "Ez a HTTP metódus nem engedélyezett ezen az URL-en.";
    case 429:
      return "Túl sok kérés — próbáld újra néhány másodperc múlva.";
    case 500:
    case 502:
    case 503:
      return "A miniCRM szerver átmenetileg nem elérhető vagy hibát jelzett.";
    default:
      if (status >= 500) return "Szerverhiba a miniCRM felől.";
      if (status >= 400) return `A kérés nem sikerült (HTTP ${status}).`;
      return `Váratlan HTTP státusz: ${status}.`;
  }
}

export function buildHttpErrorPayload(
  useMock: boolean,
  status: number,
  body: unknown
): Record<string, unknown> {
  if (useMock) {
    return { status, body };
  }
  return {
    uzenetHu: hungarianMessageForHttpStatus(status),
    httpStatus: status,
    reszletek: body,
  };
}
