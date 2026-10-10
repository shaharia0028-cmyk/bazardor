"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface SignOutButtonProps {
  /** "menu" = plain dropdown item, "outline" = red outlined button (profile page) */
  variant?: "menu" | "outline";
  className?: string;
}

export default function SignOutButton({ variant = "outline", className }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const { error } = await authClient.signOut();
    setLoading(false);

    if (error) {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    router.push("/");
    router.refresh();
  }

  const styles =
    variant === "outline"
      ? "btn btn-outline btn-error btn-sm sm:btn-md font-semibold hover:text-error-content"
      : "";

  return (
    <button type="button" role="menuitem" onClick={handleSignOut} disabled={loading} className={`${styles} ${className ?? ""}`}>
      {loading ? <span className="loading loading-spinner loading-xs" /> : "↩ সাইন আউট"}
    </button>
  );
}
