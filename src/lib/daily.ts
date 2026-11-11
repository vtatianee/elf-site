/**
 * Day-based rotation shared by the server (static HTML) and the browser.
 * No server-only imports: safe in Client Components.
 */

/** Days since 1 Jan 2026 for a local date — the same number all day. */
function dayNumber(date: Date): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((local - Date.UTC(2026, 0, 1)) / 86_400_000)
}

/** One item per calendar day, cycling through the list in order. */
export function pickForDay<T>(items: readonly T[], date: Date): T {
  const n = items.length
  const index = ((dayNumber(date) % n) + n) % n
  return items[index] as T
}
