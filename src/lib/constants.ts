import type { Product } from "./types";

export const SITE_NAME = "বাজার দর";
export const SITE_TAGLINE = "প্রয়োজনীয় পণ্যের দাম এক নজরে।";
export const DISCLAIMER = "সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।";

/** Id of the "সব পণ্য" section – the hero CTA scrolls to it. */
export const ALL_PRODUCTS_ID = "সব-পণ্য";

export const API_URL =
  process.env.BAZARDOR_API_URL ?? "https://api.api-store.workers.dev/api/bazardor";

/** How many products the "price rose / fell" sections show. */
export const MOVERS_LIMIT = 6;

/**
 * Colour of the price-change badge.
 * The Figma file paints a price RISE red (bad news for shoppers) and a FALL green.
 * The assignment text says the opposite (green up / red down) – flip `risePositive`
 * to `true` if you want to follow the text instead of the design.
 */
export const PRICE_COLORS = {
  risePositive: false,
} as const;

/** Fallback emojis when the API does not send one. */
export const CATEGORY_EMOJIS: Record<string, string> = {
  চাল: "🍚",
  ডাল: "🫘",
  তেল: "🫙",
  সবজি: "🥔",
  মাছ: "🐟",
  মাংস: "🍗",
  ডিম: "🥚",
  মসলা: "🌶️",
};

export const DEFAULT_EMOJI = "🛒";

export type Trend = "up" | "down" | "flat";

export function getTrend(product: Pick<Product, "change">): Trend {
  if (product.change > 0) return "up";
  if (product.change < 0) return "down";
  return "flat";
}
