import { DISCLAIMER, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-base-content/10 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-sm text-base-content/70 md:flex-row md:justify-between md:text-left">
        <p>
          {SITE_NAME} — {SITE_TAGLINE}
        </p>
        <p>{DISCLAIMER}</p>
      </div>
    </footer>
  );
}
