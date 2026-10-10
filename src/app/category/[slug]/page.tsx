import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import { formatNumber } from "@/lib/format";
import { findCategory, getCategoryList, getProducts, getProductsByCategory } from "@/lib/products";
import type { Category } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

async function loadCategoryPage(slug: string) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategoryList().catch(() => [] as Category[]),
  ]);
  const categoryProducts = getProductsByCategory(products, slug, categories);
  const category = findCategory(categories, slug) ?? categoryProducts[0]?.category;
  return { category, products: categoryProducts };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await loadCategoryPage(slug);
  return { title: category?.name ?? "ক্যাটাগরি" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { category, products } = await loadCategoryPage(slug);

  // unknown category → friendly 404 page with a "হোম পেজে ফিরে যান" button
  if (!category) notFound();

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-3 rounded-2xl border border-base-content/10 bg-base-100 p-5">
        <span className="text-4xl" aria-hidden>
          {category.emoji}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-base-content/70">{formatNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>

      <CategoryProducts products={products} />
    </div>
  );
}
