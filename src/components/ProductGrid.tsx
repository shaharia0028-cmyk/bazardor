import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

/** Responsive grid: 1 column on phones, 2 on tablets, 3 on desktop (4 on very wide screens). */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
