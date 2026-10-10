"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { decodeSlug } from "@/lib/products";
import type { Category } from "@/lib/types";

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="পণ্যের ধরন" className="mx-auto max-w-6xl px-4">
      <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
        {categories.map((category) => {
          const href = `/category/${encodeURIComponent(category.slug)}`;
          const isActive = decodeSlug(pathname) === `/category/${category.slug}`;

          return (
            <li key={category.slug} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors ${
                  isActive ? "bg-accent text-accent-content" : "hover:bg-base-300"
                }`}
              >
                <span aria-hidden>{category.emoji}</span>
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
