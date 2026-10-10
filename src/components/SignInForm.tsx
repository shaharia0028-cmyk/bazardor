"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { OrDivider } from "./AuthCard";
import FormField from "./FormField";
import SocialButtons from "./SocialButtons";

interface SignInFormProps {
  /** Where to go after login (set when a protected page sent the visitor here). */
  redirectTo: string;
  /** True when the visitor was redirected from a protected route. */
  fromProtectedRoute: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ redirectTo, fromProtectedRoute }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // toast for protected-route redirects
  useEffect(() => {
    if (fromProtectedRoute) toast.error("এই পৃষ্ঠা দেখতে আগে সাইন ইন করুন।", { id: "protected-route" });
  }, [fromProtectedRoute]);

  function fail(message: string) {
    setFormError(message);
    toast.error(message);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!EMAIL_PATTERN.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন।");
    if (!password) return fail("পাসওয়ার্ড লিখুন।");

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) return fail(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");

    toast.success("সফলভাবে সাইন ইন হয়েছে।");
    router.push(redirectTo);
    router.refresh(); // re-render the server header with the new session
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        label="ইমেইল"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        label="পাসওয়ার্ড"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {formError && (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {formError}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full font-semibold">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "সাইন ইন"}
      </button>

      <OrDivider />
      <SocialButtons callbackURL={redirectTo} />

      <p className="text-center text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-accent">
          সাইন আপ করুন
        </Link>
      </p>
    </form>
  );
}
