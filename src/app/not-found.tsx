import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = { title: "৪০৪ — পৃষ্ঠা পাওয়া যায়নি" };

/** Used for every unknown route, invalid category and unknown product. */
export default function NotFound() {
  return (
    <EmptyState
      emoji="🧺"
      title="৪০৪ — পৃষ্ঠাটি খুঁজে পাওয়া যায়নি"
      message="আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই, সরানো হয়েছে অথবা লিংকটি ভুল।"
    />
  );
}
