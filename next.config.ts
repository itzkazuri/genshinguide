import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['enka.network'], // 🛠️ Tambahin ini bro
  },
};

export default nextConfig;
