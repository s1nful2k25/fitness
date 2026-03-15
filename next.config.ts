import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Spart RAM: Ignoriert ESLint-Fehler beim Build im Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Spart massiv RAM: Ignoriert TypeScript-Fehler beim Build im Docker
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
