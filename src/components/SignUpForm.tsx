"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { OrDivider } from "./AuthCard";
import FormField from "./FormField";
import SocialButtons from "./SocialButtons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  function fail(message: string) {
    setFormError(message);
    toast.error(message);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (form.name.trim().length < 2) return fail("আপনার নাম লিখুন।");
    if (!EMAIL_PATTERN.test(form.email)) return fail("সঠিক ইমেইল ঠিকানা দিন।");
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return fail(`পাসওয়ার্ড কমপক্ষে ${MIN_PASSWORD_LENGTH} অক্ষরের হতে হবে।`);
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      ...(form.image.trim() ? { image: form.image.trim() } : {}),
    });
    setLoading(false);

    if (error) return fail(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
    router.push("/signin");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="নাম" name="name" autoComplete="name" placeholder="আপনার নাম" value={form.name} onChange={update("name")} />
      <FormField
        label="ইমেইল"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={update("email")}
      />
      <FormField
        label="ছবির লিংক (ঐচ্ছিক)"
        name="image"
        type="url"
        autoComplete="photo"
        placeholder="https://…"
        value={form.image}
        onChange={update("image")}
      />
      <FormField
        label="পাসওয়ার্ড"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="কমপক্ষে ৮ অক্ষর"
        value={form.password}
        onChange={update("password")}
      />

      {formError && (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {formError}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full font-semibold">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "অ্যাকাউন্ট তৈরি করুন"}
      </button>

      <OrDivider />
      <SocialButtons callbackURL="/" />

      <p className="text-center text-sm">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="font-medium text-primary hover:text-accent">
          সাইন ইন করুন
        </Link>
      </p>
    </form>
  );
}
