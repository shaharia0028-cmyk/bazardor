import { ProductGridSkeleton } from "@/components/Skeletons";

/** Skeleton shown while the category data is fetched. */
export default function CategoryLoading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-24 w-full rounded-2xl" aria-hidden />
      <div className="skeleton h-14 w-full rounded-2xl" aria-hidden />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
