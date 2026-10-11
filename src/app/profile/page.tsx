import type { Metadata } from "next";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const { user } = await requireSession("/profile");

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="text-sm text-base-content/70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      {/* user card: avatar + name + email + sign out */}
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-4 sm:flex-row sm:items-center">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name} className="size-16 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-2xl font-semibold text-primary-content">
            {user.name.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{user.name}</p>
          <p className="truncate text-sm text-base-content/70">{user.email}</p>
        </div>

        <SignOutButton variant="outline" />
      </section>

      {/* info card: name field + update button */}
      <section className="space-y-4 rounded-2xl border border-base-content/10 bg-base-100 p-5">
        <h2 className="text-lg font-semibold">তথ্য</h2>

        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-sm font-medium">
            নাম
          </label>
          <input id="profile-name" type="text" value={user.name} readOnly className="input w-full bg-base-200" />
        </div>

        {/* C3: the update button opens a separate route with the edit form */}
        <Link href="/profile/update" className="btn btn-primary w-full font-semibold">
          আপডেট
        </Link>
      </section>
    </div>
  );
}
