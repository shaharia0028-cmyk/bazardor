import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  emoji?: string;
}

/** 404-style message with a button back to the home page. */
export default function EmptyState({ title, message, emoji = "🧺" }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-6 py-12 text-center">
      <span className="text-6xl" aria-hidden>
        {emoji}
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-base-content/70">{message}</p>
      <Link href="/" className="btn btn-primary mt-2 font-semibold">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
