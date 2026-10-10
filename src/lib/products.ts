import { API_URL, CATEGORY_EMOJIS, DEFAULT_EMOJI, MOVERS_LIMIT } from "./constants";
import { parseNumber } from "./format";
import type { Category, MarketPrice, Product, SortOption } from "./types";

type Raw = Record<string, unknown>;

/* ────────────────────────────────────────────────────────────
 * Small helpers for reading the (loosely shaped) API response
 * ──────────────────────────────────────────────────────────── */

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function pickString(raw: Raw, ...keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function pickNumber(raw: Raw, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = parseNumber(raw[key]);
    if (value !== null) return value;
  }
  return null;
}

/** Keeps Bengali letters, so "সবজি" stays a readable slug. */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/** Dynamic route params may arrive URL-encoded (Bengali slugs). */
export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/* ────────────────────────────────────────────────────────────
 * Normalisers
 * ──────────────────────────────────────────────────────────── */

function normalizeCategory(raw: unknown, fallbackName = "অন্যান্য"): Category {
  const record = isRecord(raw) ? raw : {};
  const name =
    (typeof raw === "string" ? raw.trim() : pickString(record, "nameBn", "name", "name_bn", "title", "label")) ||
    fallbackName;
  const slug = pickString(record, "slug", "id") || slugify(name);
  const emoji = pickString(record, "icon", "emoji") || CATEGORY_EMOJIS[name] || DEFAULT_EMOJI;
  const aliases = [
    ...new Set([slug, name, slugify(name), pickString(record, "slug"), pickString(record, "id")].filter(Boolean)),
  ];
  return { slug, name, emoji, aliases };
}

function normalizeMarket(raw: unknown): MarketPrice | null {
  if (!isRecord(raw)) return null;
  const avgValue = pickNumber(raw, "avg", "average", "avgPrice", "price", "today", "গড়");
  const min = pickNumber(raw, "min", "minPrice", "lowest", "সর্বনিম্ন") ?? avgValue;
  const max = pickNumber(raw, "max", "maxPrice", "highest", "সর্বাধিক") ?? avgValue;
  if (min === null || max === null) return null;
  // the API sends only min and max – the average is the midpoint
  const avg = avgValue ?? (min + max) / 2;
  return {
    market: pickString(raw, "market", "marketName", "nameBn", "name", "bazar", "বাজার") || "—",
    region: pickString(raw, "division", "region", "district", "city", "location", "বিভাগ") || "—",
    min,
    max,
    avg: Math.round(avg * 10) / 10,
  };
}

const UNIT_NAMES: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
  hali: "হালি",
};

function normalizeProduct(raw: unknown, inheritedCategory?: Category): Product | null {
  if (!isRecord(raw)) return null;

  const name = pickString(raw, "nameBn", "name", "name_bn", "title", "product");
  if (!name) return null;

  // price can be a flat number or an object such as { today, yesterday, min, max, avg }
  const priceObject = isRecord(raw.price) ? raw.price : raw;
  const price = pickNumber(priceObject, "today", "current", "price", "todayPrice", "currentPrice", "avg");
  if (price === null) return null;

  const previousPrice = pickNumber(
    priceObject,
    "yesterday",
    "previous",
    "previousPrice",
    "yesterdayPrice",
    "prevPrice",
    "lastPrice",
  );

  // change is { dir: "up" | "down", pct: 2.1 } – or a plain number in other shapes
  let apiChange: number | null = null;
  if (isRecord(raw.change)) {
    const pct = pickNumber(raw.change, "pct", "percent", "value");
    const dir = pickString(raw.change, "dir", "direction");
    if (pct !== null) apiChange = dir === "down" ? -Math.abs(pct) : dir === "up" ? Math.abs(pct) : pct;
  } else {
    apiChange = pickNumber(raw, "changePercent", "change_percent", "percentChange", "percent", "change", "changePct");
  }
  const computedChange =
    previousPrice && previousPrice !== 0 ? ((price - previousPrice) / previousPrice) * 100 : 0;
  const change = Math.round((apiChange ?? computedChange) * 10) / 10;

  // category is a slug string plus categoryNameBn / categoryIcon (or a nested object)
  const hasCategory = raw.category !== undefined || raw.categoryNameBn !== undefined;
  const rawCategory = isRecord(raw.category)
    ? raw.category
    : { slug: raw.category, nameBn: raw.categoryNameBn, icon: raw.categoryIcon };
  const category = hasCategory ? normalizeCategory(rawCategory) : (inheritedCategory ?? normalizeCategory(undefined));

  const rawUnit = pickString(raw, "unit", "unit_bn", "unitBn") || "kg";
  const unitName = UNIT_NAMES[rawUnit.toLowerCase()] ?? rawUnit;
  const unit = unitName.startsWith("প্রতি") ? unitName : `প্রতি ${unitName}`;

  // "image" holds an emoji here – ignore it if it looks like a URL
  const image = pickString(raw, "image");
  const imageEmoji = image && image.length <= 8 && !image.includes("/") && !image.includes(".") ? image : "";

  const rawMarkets = [raw.markets, raw.marketPrices, raw.market_prices, raw.bazars, raw.prices].find(Array.isArray) as unknown[] | undefined;
  const markets = (rawMarkets ?? []).map(normalizeMarket).filter((m): m is MarketPrice => m !== null);

  const marketMins = markets.map((m) => m.min);
  const marketMaxs = markets.map((m) => m.max);
  const marketAvgs = markets.map((m) => m.avg);

  const min = pickNumber(priceObject, "min", "minPrice") ?? (marketMins.length ? Math.min(...marketMins) : price);
  const max = pickNumber(priceObject, "max", "maxPrice") ?? (marketMaxs.length ? Math.max(...marketMaxs) : price);
  const avg =
    pickNumber(priceObject, "avg", "average", "avgPrice") ??
    (marketAvgs.length ? marketAvgs.reduce((sum, v) => sum + v, 0) / marketAvgs.length : price);

  return {
    id: pickString(raw, "id", "_id"),
    slug: pickString(raw, "slug", "id", "_id") || slugify(name),
    name,
    emoji: pickString(raw, "emoji", "icon") || imageEmoji || category.emoji,
    unit,
    category,
    description: pickString(raw, "description", "summary", "subtitle"),
    price,
    previousPrice,
    change,
    markets,
    min,
    max,
    avg: Math.round(avg * 100) / 100,
  };
}

/** Accepts [..], { products: [..] }, { data: [..] } or a list of categories that contain products. */
function extractItems(json: unknown): { raw: unknown; category?: Category }[] {
  const list = Array.isArray(json)
    ? json
    : isRecord(json)
      ? ((json.products ?? json.data ?? json.items ?? json.results ?? Object.values(json).find(Array.isArray)) as unknown)
      : null;

  if (!Array.isArray(list)) return [];

  return list.flatMap((item) => {
    if (isRecord(item) && Array.isArray(item.products)) {
      const category = normalizeCategory(item);
      return item.products.map((raw: unknown) => ({ raw, category }));
    }
    return [{ raw: item }];
  });
}

/* ────────────────────────────────────────────────────────────
 * Public data functions
 * ──────────────────────────────────────────────────────────── */

/** Fetches and normalises all products. Cached for 5 minutes by Next.js. */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Products API responded with ${response.status}`);

  const json: unknown = await response.json();
  const products = extractItems(json)
    .map(({ raw, category }) => normalizeProduct(raw, category))
    .filter((product): product is Product => product !== null);

  // make sure slugs are unique, otherwise two products would share one URL
  const used = new Set<string>();
  return products.map((product) => {
    let slug = product.slug;
    for (let i = 2; used.has(slug); i++) slug = `${product.slug}-${i}`;
    used.add(slug);
    return { ...product, slug };
  });
}

/** Fetches /products/{id}, which also contains the bazar-wise prices. */
export async function getProductDetail(product: Product): Promise<Product> {
  if (!product.id) return product;
  try {
    const response = await fetch(`${API_URL}/products/${product.id}`, { next: { revalidate: 300 } });
    if (!response.ok) return product;
    const detail = normalizeProduct(await response.json(), product.category);
    return detail ? { ...detail, slug: product.slug } : product;
  } catch {
    return product;
  }
}

/** Fetches the category list for the navbar from /categories. */
export async function getCategoryList(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Categories API responded with ${response.status}`);

  const json: unknown = await response.json();
  const list = Array.isArray(json)
    ? json
    : isRecord(json)
      ? (json.categories ?? json.data ?? json.items ?? Object.values(json).find(Array.isArray))
      : null;

  return Array.isArray(list) ? list.map((item) => normalizeCategory(item)) : [];
}

export function findProduct(products: Product[], slug: string): Product | undefined {
  const wanted = decodeSlug(slug);
  return products.find((product) => product.slug === wanted);
}

/** Unique categories in the order they first appear in the API data. */
export function getCategories(products: Product[]): Category[] {
  const map = new Map<string, Category>();
  for (const product of products) {
    if (!map.has(product.category.slug)) map.set(product.category.slug, product.category);
  }
  return [...map.values()];
}

/** Finds a category from the /categories list by slug, id or name. */
export function findCategory(categories: Category[], categorySlug: string): Category | undefined {
  const wanted = decodeSlug(categorySlug);
  return categories.find((category) => category.aliases.includes(wanted));
}

export function getProductsByCategory(products: Product[], categorySlug: string, categories: Category[] = []): Product[] {
  const wanted = decodeSlug(categorySlug);
  const wantedAliases = findCategory(categories, wanted)?.aliases ?? [wanted];
  return products.filter((product) => product.category.aliases.some((alias) => wantedAliases.includes(alias)));
}

export function getTopRisers(products: Product[], limit = MOVERS_LIMIT): Product[] {
  return products
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, limit);
}

export function getTopFallers(products: Product[], limit = MOVERS_LIMIT): Product[] {
  return products
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, limit);
}

/** Sorts by the numeric price – never by the Bengali string. */
export function sortProducts(products: Product[], option: SortOption): Product[] {
  if (option === "asc") return [...products].sort((a, b) => a.price - b.price);
  if (option === "desc") return [...products].sort((a, b) => b.price - a.price);
  return products;
}
