import Image from "next/image";
import { ALL_PRODUCTS_ID } from "@/lib/constants";
import { formatBanglaDate } from "@/lib/format";

export default function Hero() {
  return (
    <section className="grid items-center gap-6 rounded-3xl border border-base-content/10 bg-base-100 p-6 md:grid-cols-2 md:p-10">
      <div className="flex flex-col items-start gap-3">
        {/* eyebrow */}
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {formatBanglaDate()}
        </span>
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
        <p className="text-base-content/80">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
          দামের পরিবর্তন এক জায়গায়।
        </p>
        {/* Anchor link: scrolls down the same page, no route change */}
        <a href={`#${ALL_PRODUCTS_ID}`} className="btn btn-primary mt-2 font-semibold">
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="flex justify-center md:justify-end">
        <Image
          src="/images/bazar-hero.png"
          alt="সবজি ও ফলে ভরা ঝুড়ি"
          width={315}
          height={263}
          priority
          className="h-auto w-full max-w-xs md:max-w-sm"
        />
      </div>
    </section>
  );
}
