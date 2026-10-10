"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SignOutButton from "./SignOutButton";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
}

export function Avatar({ name, image, size = 36 }: { name: string; image?: string | null; size?: number }) {
  const style = { width: size, height: size };
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} style={style} className="rounded-full object-cover" />;
  }
  return (
    <span
      style={style}
      className="flex items-center justify-center rounded-full bg-primary font-semibold text-primary-content"
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="btn btn-ghost btn-sm sm:btn-md gap-2 px-1.5 sm:px-2"
      >
        <Avatar name={name} image={image} size={32} />
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{name.split(" ")[0]}</span>
        <span aria-hidden className="text-xs">▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-base-content/10 bg-base-100 p-2 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-base-content/70">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-1.5 text-sm hover:bg-base-200"
          >
            👤 আমার প্রোফাইল
          </Link>
          <SignOutButton
            variant="menu"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-sm text-error hover:bg-base-200"
          />
        </div>
      )}
    </div>
  );
}
