import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/UserMenu";
import SignOutButton from "@/components/SignOutButton";
import { formatBanglaDateTime } from "@/lib/format";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const { user, session } = await requireSession("/profile");

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="text-sm text-base-content/70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      {/* user card */}
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:flex-row sm:items-center">
        <Avatar name={user.name} image={user.image} size={72} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold">{user.name}</p>
          <p className="truncate text-base-content/80">{user.email}</p>
        </div>
        <SignOutButton variant="outline" />
      </section>

      {/* info card */}
      <section className="space-y-4 rounded-2xl border border-base-content/10 bg-base-100 p-5">
        <h2 className="text-lg font-semibold">তথ্য</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-base-200 p-3">
            <p className="text-xs text-base-content/70">নাম</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div className="rounded-2xl bg-base-200 p-3">
            <p className="text-xs text-base-content/70">সেশন শুরু</p>
            <p className="font-medium">{formatBanglaDateTime(new Date(session.createdAt))}</p>
          </div>
        </div>

        {/* C3: the update button opens a separate route with the form */}
        <Link href="/profile/update" className="btn btn-primary w-full font-semibold">
          আপডেট
        </Link>
      </section>
    </div>
  );
}
