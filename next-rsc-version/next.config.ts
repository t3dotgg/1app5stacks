import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: true,
    dynamicIO: true,
    cacheLife: {
      default: {
        expire: 60, // 1 minute
        revalidate: 60, // 1 minute
      },
      forever: {
        expire: 999999999,
        revalidate: 999999999,
      },
    },
  },
};

export default nextConfig;
