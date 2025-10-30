import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Suppress turbopack root warning
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
