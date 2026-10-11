import Link from "next/link";
import { getCategoryList } from "@/lib/products";
import { formatBanglaDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import { SITE_NAME } from "@/lib/constants";
import type { Category } from "@/lib/types";
import CategoryNav from "./CategoryNav";
import UserMenu from "./UserMenu";

async function loadCategories(): Promise<Category[]> {
  try {
    return await getCategoryList();
  } catch {
    return []; // the page itself shows the error – the header must not break
  }
}

export default async function Header() {
  const [session, categories] = await Promise.all([getSession(), loadCategories()]);

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        {/* Logo + Bangla date */}
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label={`${SITE_NAME} – হোম`}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-base sm:size-10 sm:text-lg">🛒</span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-lg font-bold sm:text-xl">{SITE_NAME}</span>
            <span className="truncate text-[11px] text-base-content/70 sm:text-xs">{formatBanglaDate()}</span>
          </span>
        </Link>

        {/* Auth buttons / user menu */}
        {session ? (
          <UserMenu name={session.user.name} email={session.user.email} image={session.user.image} />
        ) : (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md font-semibold">
              সাইন ইন
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md font-semibold">
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      {/* Category links (second row) */}
      {categories.length > 0 && (
        <div className="border-t border-base-content/10">
          <CategoryNav categories={categories} />
        </div>
      )}
    </header>
  );
}
