/** Loading placeholders – shown by the loading.tsx files while data is fetched. */

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-base-content/10 bg-base-100 p-4" aria-hidden>
      <div className="flex items-center gap-3">
        <div className="skeleton size-12 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-14" />
          <div className="skeleton h-6 w-20" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="লোড হচ্ছে…">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="skeleton h-72 w-full rounded-3xl" aria-hidden />;
}

export function SectionTitleSkeleton() {
  return <div className="skeleton mb-4 h-7 w-40" aria-hidden />;
}
