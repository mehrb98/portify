import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: true,
   output: 'standalone',
   productionBrowserSourceMaps: false,
   eslint: { ignoreDuringBuilds: true },
   compiler: { removeConsole: process.env.NODE_ENV === "production" }
};

export default nextConfig;
