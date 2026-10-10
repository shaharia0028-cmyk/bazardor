"use client";

import Link from "next/link";

/** Shown when something fails while rendering (e.g. the price API is down). */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-6 py-12 text-center">
      <span className="text-6xl" aria-hidden>
        ⚠️
      </span>
      <h2 className="text-2xl font-bold">কিছু একটা ভুল হয়েছে</h2>
      <p className="text-base-content/70">দামের তথ্য এই মুহূর্তে আনা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।</p>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={reset} className="btn btn-primary font-semibold">
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="btn btn-ghost font-semibold">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
