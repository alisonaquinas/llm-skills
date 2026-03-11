import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/llm-skills",
  assetPrefix: "/llm-skills/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
