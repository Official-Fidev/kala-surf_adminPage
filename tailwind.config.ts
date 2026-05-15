/**
 * tailwind.config.ts — Kala Surf Admin
 *
 * NOTE: This project uses Tailwind v4 via @tailwindcss/postcss.
 * In v4 the canonical source of truth for theme tokens lives in globals.css
 * (CSS custom properties). This file is retained for IDE IntelliSense and
 * for any v4-compat config options that aren't yet in CSS-first config.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New Design System ───────────────────────────────────
        background: '#fcf9f7',
        foreground: '#1b1c1b',
        primary: '#153951',
        'on-primary': '#ffffff',
        secondary: '#645d57',
        'on-secondary': '#ffffff',
        surface: '#fcf9f7',
        'on-surface': '#1b1c1b',
        outline: '#73787d',
        'outline-variant': '#c2c7cd',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f1',
        'surface-container': '#f0edeb',
        'surface-container-high': '#eae8e6',
        'surface-container-highest': '#e5e2e0',
        'primary-container': '#2f5069',
        'on-primary-container': '#a0c2df',
        'secondary-container': '#ebe1d9',
        'on-secondary-container': '#6a635d',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        success: '#15803d',
      },

      fontFamily: {
        // Headings (Oswald)
        heading:   ["Oswald", "sans-serif"],
        // Brand wordmark (CabinetGrotesk loaded via layout.tsx)
        brand:     ["CabinetGrotesk", "Impact", "sans-serif"],
        // Body copy / tables / UI
        paragraph: ["Quicksand", "sans-serif"],
        // Default UI fallback
        ui:        ["Arial", "'Helvetica Neue'", "sans-serif"],
      },

      fontSize: {
        "ui-base": ["14px", { lineHeight: "20px" }],
      },

      boxShadow: {
        card:       "0 2px 16px 0 rgba(47, 80, 105, 0.08)",
        "card-hover":"0 8px 32px 0 rgba(47, 80, 105, 0.15)",
        sidebar:    "4px 0 32px 0 rgba(47, 80, 105, 0.22)",
      },

      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
      },

      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.55" },
        },
        shimmer: {
          from: { backgroundPosition: "-400px 0" },
          to:   { backgroundPosition:  "400px 0" },
        },
      },

      animation: {
        // Smooth spring-like entry
        "fade-in-up":  "fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft":  "pulse-soft 2.2s ease-in-out infinite",
        shimmer:       "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;