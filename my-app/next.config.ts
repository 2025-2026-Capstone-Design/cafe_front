import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 경로 최적화 설정 추가
  outputFileTracingRoot: __dirname, 
};

export default nextConfig;