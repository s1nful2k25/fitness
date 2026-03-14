import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignoriert ESLint-Fehler beim Build (spart RAM)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignoriert TypeScript-Fehler beim Build (spart massiv RAM)
  typescript: {
    ignoreBuildErrors: true,
  },
  // ... (deine restlichen Einstellungen bleiben hier stehen)
};

module.exports = nextConfig; // oder 'export default nextConfig;'
