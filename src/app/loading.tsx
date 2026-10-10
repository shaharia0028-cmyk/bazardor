import { HeroSkeleton, ProductGridSkeleton, SectionTitleSkeleton } from "@/components/Skeletons";

/** Shown while the home page data is being fetched. */
export default function HomeLoading() {
  return (
    <div className="space-y-10">
      <HeroSkeleton />
      <section>
        <SectionTitleSkeleton />
        <ProductGridSkeleton count={6} />
      </section>
      <section>
        <SectionTitleSkeleton />
        <ProductGridSkeleton count={6} />
      </section>
    </div>
  );
}
