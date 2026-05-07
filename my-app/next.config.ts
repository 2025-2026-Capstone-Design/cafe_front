import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ldb-phinf.pstatic.net' },
      { protocol: 'https', hostname: '*.pstatic.net' },
      { protocol: 'https', hostname: '*.naver.net' },
    ],
  },
};

export default nextConfig;