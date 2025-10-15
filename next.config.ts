import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' }; // Remove logs
    config.stats = 'errors-warnings';
    return config;
  },
};

export default nextConfig;
