import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep unrelated parent lockfiles from changing the application root.
    root: process.cwd(),
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};

export default nextConfig;
