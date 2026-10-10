import { getTrend } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { trendColor } from "./PriceBadge";
import ProductGrid from "./ProductGrid";

interface PriceMoversProps {
  direction: "up" | "down";
  products: Product[];
}

/** "আজ দাম বেড়েছে ▲" / "আজ দাম কমেছে ▼" sections of the home page. */
export default function PriceMovers({ direction, products }: PriceMoversProps) {
  const isUp = direction === "up";
  const title = isUp ? "আজ দাম বেড়েছে" : "আজ দাম কমেছে";
  const color = trendColor(getTrend({ change: isUp ? 1 : -1 }));

  return (
    <section aria-labelledby={`movers-${direction}`}>
      <h2 id={`movers-${direction}`} className="mb-4 flex items-center gap-2 text-xl font-bold">
        <span className={`text-base ${color}`} aria-hidden>
          {isUp ? "▲" : "▼"}
        </span>
        {title}
      </h2>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-base-content/10 bg-base-100 p-4 text-sm text-base-content/70">
          আজ এখনো কোনো পণ্যের দাম {isUp ? "বাড়েনি" : "কমেনি"}।
        </p>
      )}
    </section>
  );
}
