/** A product category (e.g. চাল, সবজি). */
export interface Category {
  slug: string;
  name: string;
  emoji: string;
  /** Every identifier the API may use for this category (slug, id, name). */
  aliases: string[];
}

/** Price of one product in one bazar (market). */
export interface MarketPrice {
  market: string;
  region: string;
  min: number;
  max: number;
  avg: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  /** Unit line, e.g. "প্রতি কেজি". */
  unit: string;
  category: Category;
  description: string;
  /** Today's price in BDT. */
  price: number;
  /** Yesterday's price, when the API provides it. */
  previousPrice: number | null;
  /** Signed change in percent (positive = price went up). */
  change: number;
  markets: MarketPrice[];
  min: number;
  max: number;
  avg: number;
}

export type SortOption = "default" | "asc" | "desc";
