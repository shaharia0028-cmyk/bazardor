"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: { fontFamily: "inherit", fontSize: "14px", background: "#fafcfa", color: "#1d271f" },
        success: { iconTheme: { primary: "#05893e", secondary: "#f3fbf4" } },
        error: { iconTheme: { primary: "#d03739", secondary: "#fff6f5" } },
      }}
    />
  );
}
