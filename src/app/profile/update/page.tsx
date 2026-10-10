import type { Metadata } from "next";
import AuthCard from "@/components/AuthCard";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "তথ্য আপডেট" };

export default async function UpdateProfilePage() {
  const { user } = await requireSession("/profile/update");

  return (
    <AuthCard title="তথ্য আপডেট করুন" subtitle="আপনার নাম পরিবর্তন করুন।">
      <UpdateProfileForm currentName={user.name} />
    </AuthCard>
  );
}
