"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import FormField from "./FormField";

/** Updates the user's name with BetterAuth's `updateUser`. */
export default function UpdateProfileForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setLoading(false);

    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি।");
      return;
    }

    toast.success("তথ্য সফলভাবে আপডেট হয়েছে।");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="নাম" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Link href="/profile" className="btn btn-ghost font-semibold sm:flex-1">
          বাতিল
        </Link>
        <button type="submit" disabled={loading} className="btn btn-primary font-semibold sm:flex-1">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}
        </button>
      </div>
    </form>
  );
}
