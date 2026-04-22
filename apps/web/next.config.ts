import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@loreal/contracts", "@loreal/utils"],
};

export default nextConfig;
