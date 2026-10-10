import { getProducts } from "@/lib/products";
import { formatPrice, shortUnit } from "@/lib/format";
import type { Product } from "@/lib/types";
import { TrendText } from "./PriceBadge";

function TickerItem({ product }: { product: Product }) {
  return (
    <li className="flex shrink-0 items-center gap-2 px-4 text-sm">
      <span aria-hidden>{product.emoji}</span>
      <span className="font-medium">{product.name}</span>
      <span className="text-base-content/80">
        {formatPrice(product.price)}/{shortUnit(product.unit)}
      </span>
      <TrendText change={product.change} />
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
      <div className="ticker-track py-2">
        {/* The list is rendered twice so the -50% translate loops seamlessly. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1}>
            {products.map((product) => (
              <TickerItem key={`${copy}-${product.slug}`} product={product} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
