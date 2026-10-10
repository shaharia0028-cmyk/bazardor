import Hero from "@/components/Hero";
import PriceMovers from "@/components/PriceMovers";
import ProductGrid from "@/components/ProductGrid";
import { ALL_PRODUCTS_ID } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { getProducts, getTopFallers, getTopRisers } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-10">
      <Hero />

      {/* Section A – top 6 risers, Section B – top 6 fallers */}
      <PriceMovers direction="up" products={getTopRisers(products)} />
      <PriceMovers direction="down" products={getTopFallers(products)} />

      {/* Section C – every product */}
      <section id={ALL_PRODUCTS_ID} aria-labelledby="all-products-title">
        <h2 id="all-products-title" className="text-xl font-bold">
          সব পণ্য
        </h2>
        <p className="mb-4 mt-1 text-sm">মোট {formatNumber(products.length)}টি পণ্য দেখানো হচ্ছে</p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
