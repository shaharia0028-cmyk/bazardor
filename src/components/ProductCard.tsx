import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import PriceBadge from "./PriceBadge";

/** Clicking a card opens the (protected) product detail page. */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="block rounded-2xl border border-base-content/10 bg-base-100 p-4 transition-colors hover:border-primary/40 hover:bg-base-300/40 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl">
          {product.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{product.name}</h3>
          <p className="text-xs text-base-content/70">{product.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-base-content/70">আজকের দাম</p>
          <p className="text-xl font-bold">{formatPrice(product.price)}</p>
        </div>
        <div className="pb-1">
          <PriceBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
}
