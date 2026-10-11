import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // lets a phone on the same Wi-Fi load the dev CSS/JS (use your PC's IP)
  allowedDevOrigins: ["192.168.0.10"],
};

export default nextConfig;