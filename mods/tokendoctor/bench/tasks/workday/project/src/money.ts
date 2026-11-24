// See README.md.
export class MoneyError extends Error {}
export function parseMoney(text: string): number { throw new Error("nicht implemented"); }
export function formatMoney(cents: number, currency: "USD" | "EUR" = "USD"): string { throw new Error("nicht implemented"); }
export function allocate(cents: number, ratios: number[]): number[] { throw new Error("nicht implemented"); }
