import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import SignInForm from "@/components/SignInForm";
import { getSession, safeRedirect } from "@/lib/session";

export const metadata: Metadata = { title: "সাইন ইন" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; reason?: string }>;
}) {
  const { redirect: redirectParam, reason } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);

  // already logged in → nothing to do here
  if (await getSession()) redirect(redirectTo);

  return (
    <AuthCard title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <SignInForm redirectTo={redirectTo} fromProtectedRoute={reason === "protected"} />
    </AuthCard>
  );
}
