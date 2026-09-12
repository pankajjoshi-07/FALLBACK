import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--color-page)",
        secondary: "var(--color-secondary)",
        panel: "var(--color-panel)",
        "panel-elevated": "var(--color-panel-elevated)",
        border: "var(--color-border)",
        gold: {
          DEFAULT: "var(--color-gold)",
          glow: "var(--color-gold-glow)",
          dark: "var(--color-gold-dark)",
        },
        xp: {
          DEFAULT: "var(--color-xp)",
          light: "var(--color-xp-light)",
          glow: "var(--color-xp-glow)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          glow: "rgba(224, 69, 93, 0.3)",
        },
        info: "var(--color-info)",
        success: "var(--color-success)",
        foreground: {
          DEFAULT: "var(--color-text-primary)",
          muted: "var(--color-text-muted)",
        },
        // Attribute specific theme colors
        attr: {
          strength: "#F87171",
          intellect: "#60A5FA",
          discipline: "#FBBF24",
          vitality: "#34D399",
          charisma: "#C084FC",
        },
      },
      fontFamily: {
        heading: ["Cinzel", "serif"],
        sans: ["Sora", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        panel: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-border)",
        glow: "0 0 15px -3px var(--color-gold-glow)",
        "glow-xp": "0 0 15px -3px var(--color-xp-glow)",
        "glow-crimson": "0 0 15px -3px rgba(224, 69, 93, 0.4)",
        "glow-emerald": "0 0 15px -3px rgba(52, 211, 153, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
