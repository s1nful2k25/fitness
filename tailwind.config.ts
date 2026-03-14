import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      borderColor: {
        brutal: "var(--border)",
      }
    },
  },
  plugins: [],
} satisfies Config;
