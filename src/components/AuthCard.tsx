import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** Centered card layout shared by the sign-in and sign-up pages. */
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md space-y-5 py-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-base-content/70">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-base-content/10 bg-base-100 p-6">{children}</div>
      <Link href="/" className="inline-block text-sm hover:text-primary">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs text-base-content/70">
      <span className="h-px flex-1 bg-base-content/15" />
      অথবা
      <span className="h-px flex-1 bg-base-content/15" />
    </div>
  );
}
