import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**", // Permite cualquier dominio para abarcar tu URL dinámica de Cloudflare R2
      },
    ],
  },
};

export default nextConfig;
