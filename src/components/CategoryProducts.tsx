"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { sortProducts } from "@/lib/products";
import type { Product, SortOption } from "@/lib/types";
import EmptyState from "./EmptyState";
import ProductGrid from "./ProductGrid";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

/** Sort bar + product list of a category page. */
export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>("default");

  if (products.length === 0) {
    return <EmptyState title="কোনো পণ্য পাওয়া যায়নি" message="এই ধরনের কোনো পণ্য এখন তালিকায় নেই।" />;
  }

  const sorted = sortProducts(products, sort);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3">
        <label htmlFor="sort" className="text-sm">
          সাজান
        </label>
        {/* daisyUI select already draws the chevron icon */}
        <select
          id="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className="select select-sm w-auto text-xs"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm">মোট {formatNumber(sorted.length)}টি পণ্য দেখানো হচ্ছে</p>
      <ProductGrid products={sorted} />
    </div>
  );
}
