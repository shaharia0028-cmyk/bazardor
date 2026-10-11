import Link from "next/link";
import { getProducts } from "@/lib/products";
import { formatPrice, shortUnit } from "@/lib/format";
import type { Product } from "@/lib/types";
import { TrendText } from "./PriceBadge";

/** One scrolling item. Clicking it opens the product's detail page. */
function TickerItem({ product, focusable }: { product: Product; focusable: boolean }) {
  return (
    <li className="shrink-0">
      <Link
        href={`/product/${encodeURIComponent(product.slug)}`}
        tabIndex={focusable ? 0 : -1}
        className="flex items-center gap-2 px-4 py-1 text-sm transition-colors hover:bg-base-200"
      >
        <span aria-hidden>{product.emoji}</span>
        <span className="font-medium">{product.name}</span>
        <span className="text-base-content/80">
          {formatPrice(product.price)}/{shortUnit(product.unit)}
        </span>
        <TrendText change={product.change} />
      </Link>
    </li>
  );
}

/** Infinite scrolling price strip below the navbar (pure CSS marquee). */
export default async function PriceTicker() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    return null; // no data → no ticker (the page shows its own error)
  }
  if (products.length === 0) return null;

  return (
    <div className="ticker overflow-hidden border-b border-base-content/10 bg-base-100" aria-label="আজকের দামের তালিকা">
      <div className="ticker-track py-1">
        {/* The list is rendered twice so the -50% translate loops seamlessly. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1}>
            {products.map((product) => (
              <TickerItem key={`${copy}-${product.slug}`} product={product} focusable={copy === 0} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}