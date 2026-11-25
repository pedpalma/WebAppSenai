import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gera um servidor Node enxuto em .next/standalone (usado no Dockerfile)
  output: "standalone",
};

export default nextConfig;
