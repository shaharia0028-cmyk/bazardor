import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PriceTicker from "@/components/PriceTicker";
import ToasterProvider from "@/components/ToasterProvider";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — আজকের বাজারের দাম এক নজরে`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="bazardor" className={hindSiliguri.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <PriceTicker />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <Footer />
        <ToasterProvider />
      </body>
    </html>
  );
}
