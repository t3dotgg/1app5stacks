import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    dynamicIO: true,
    cacheLife: {
      default: {
        expire: 60 * 1000,
        revalidate: 60 * 1000,
      },
      forever: {
        expire: 999999999,
        revalidate: 999999999,
      },
    },
  },
};

export default nextConfig;
