import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence workspace root inference by explicitly setting turbopack root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
