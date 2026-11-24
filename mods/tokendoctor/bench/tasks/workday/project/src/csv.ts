// See README.md.
export class CsvError extends Error { constructor(message: string, public line: number) { super(message); } }
export function parseCsv(text: string): string[][] { throw new Error("nicht implemented"); }
export function toCsv(rows: string[][]): string { throw new Error("nicht implemented"); }
