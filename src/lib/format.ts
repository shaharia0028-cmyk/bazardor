const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Converts every western digit in a string to its Bengali form. */
export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Converts every Bengali digit in a string to a western digit. */
export function toWesternDigits(value: string): string {
  return value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/**
 * Parses numbers such as 148, "148", "১,৮৫০ টাকা" or "২.১%" into a real number.
 * This is what makes sorting work on Bengali numerals (numeric, not string order).
 */
export function parseNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = toWesternDigits(value).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return cleaned ? Number(cleaned[0]) : null;
}

/** 1850 → "১,৮৫০" */
export function formatNumber(value: number, maxFractionDigits = 2): string {
  const text = value.toLocaleString("en-US", { maximumFractionDigits: maxFractionDigits });
  return toBengaliDigits(text);
}

/** 148 → "১৪৮ টাকা" */
export function formatPrice(value: number): string {
  return `${formatNumber(value)} টাকা`;
}

/** 2.14 → "২.১%" (sign is shown by the arrow, so the value is absolute) */
export function formatPercent(value: number): string {
  return `${toBengaliDigits(Math.abs(value).toFixed(1))}%`;
}

/** "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" (Dhaka time) */
export function formatBanglaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

/** "সোমবার, ৫ অক্টোবর, ২০২৬ — রাত ৮:২৭" (Dhaka time) */
export function formatBanglaDateTime(date: Date): string {
  const time = new Intl.DateTimeFormat("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(date);
  return `${formatBanglaDate(date)} — ${time}`;
}

/** "প্রতি কেজি" → "কেজি" (used in the ticker: ১৪৮ টাকা/কেজি) */
export function shortUnit(unit: string): string {
  return unit.replace(/^প্রতি\s*/, "").trim();
}
