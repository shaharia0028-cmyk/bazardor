import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrendText } from "@/components/PriceBadge";
import { getTrend } from "@/lib/constants";
import { formatNumber, formatPrice, shortUnit } from "@/lib/format";
import { findProduct, getProductDetail, getProducts } from "@/lib/products";
import { requireSession } from "@/lib/session";
import type { Product } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(await getProducts(), slug);
  return { title: product?.name ?? "পণ্যের বিবরণ" };
}

/** "গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা" */
function changeSummary(product: Product): string {
  const trend = getTrend(product);
  if (trend === "flat") return "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  const verb = trend === "up" ? "বেড়েছে" : "কমেছে";
  const amount = product.previousPrice !== null ? ` · ${formatPrice(Math.abs(product.price - product.previousPrice))}` : "";
  return `গতকালের তুলনায় আজ দাম ${verb}${amount}`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Protected route: logged-out visitors are redirected to /signin (with a toast)
  await requireSession(`/product/${slug}`);

  const listed = findProduct(await getProducts(), slug);
  if (!listed) notFound();

  // the detail endpoint also contains the bazar-wise prices
  const product = await getProductDetail(listed);

  const categoryHref = `/category/${encodeURIComponent(product.category.slug)}`;

  const stats = [
    { label: "সর্বনিম্ন দাম", value: product.min, caption: "সবচেয়ে কম দামের বাজার", color: "text-success" },
    { label: "সর্বোচ্চ দাম", value: product.max, caption: "সবচেয়ে বেশি দামের বাজার", color: "text-error" },
    { label: "গড় দাম", value: product.avg, caption: "সব বাজারের গড়", color: "" },
  ];

  return (
    <div className="space-y-4">
      {/* breadcrumbs */}
      <nav aria-label="breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-base-content/80">
          <li>
            <Link href="/" className="hover:text-primary">
              হোম
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href={categoryHref} className="hover:text-primary">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-base-content">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* summary header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 md:flex-row md:items-center">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl">
          {product.emoji}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-base-content/70">
            {product.unit} · {product.category.name}
          </p>
          {product.description && <p className="text-sm text-base-content/80">{product.description}</p>}
          <p className="pt-1 text-sm">{changeSummary(product)}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={categoryHref} className="badge badge-soft badge-primary">
              {product.category.emoji} {product.category.name}
            </Link>
            <span className="badge badge-ghost">{shortUnit(product.unit)}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-base-200 px-5 py-4 text-center">
          <p className="text-sm text-base-content/70">আজকের দাম</p>
          <p className="text-3xl font-bold">{formatNumber(product.price)}</p>
          <p className="text-sm text-base-content/70">টাকা / {shortUnit(product.unit)}</p>
          <TrendText change={product.change} className="text-sm" />
        </div>
      </section>

      {/* price summary + per-market table */}
      <section className="space-y-6 rounded-2xl border border-base-content/10 bg-base-100 p-5">
        <div>
          <h2 className="mb-3 text-lg font-semibold">দামের সারসংক্ষেপ</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-base-content/10 bg-base-100 p-5">
                <p className="text-xs text-base-content/70">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{formatPrice(stat.value)}</p>
                <p className="text-xs text-base-content/70">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">বাজারভিত্তিক আজকের দাম</h2>
          {product.markets.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-base-content/10">
              <table className="table min-w-[560px]">
                <thead>
                  <tr className="text-sm text-base-content">
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th className="text-right">সর্বনিম্ন</th>
                    <th className="text-right">সর্বাধিক</th>
                    <th className="text-right">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((market, index) => (
                    <tr key={`${market.market}-${market.region}-${index}`} className={index % 2 === 1 ? "bg-base-200" : ""}>
                      <td className="font-medium">{market.market}</td>
                      <td>{market.region}</td>
                      <td className="text-right">{formatPrice(market.min)}</td>
                      <td className="text-right">{formatPrice(market.max)}</td>
                      <td className="text-right font-semibold">{formatPrice(market.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </section>

      <Link href={categoryHref} className="btn btn-ghost font-semibold">
        {product.category.emoji} সব {product.category.name}
      </Link>
    </div>
  );
}
