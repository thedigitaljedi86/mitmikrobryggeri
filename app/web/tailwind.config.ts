import type { Config } from "tailwindcss";

/**
 * Designsystemet fra CLAUDE.md §9 — stilrent, minimalistisk, håndværker-varmt.
 * Farve- og form-tokens spejler CSS-variablerne i globals.css, så Tailwind-klasser
 * og komponentklasser altid trækker på samme kilde.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        baggrund: "var(--baggrund)",
        flade: "var(--flade)",
        kant: "var(--kant)",
        "kant-svag": "var(--kant-svag)",
        tekst: "var(--tekst)",
        "tekst-daempet": "var(--tekst-daempet)",
        "tekst-blod": "var(--tekst-blod)",
        accent: "var(--accent)",
        succes: "var(--succes)",
        advarsel: "var(--advarsel)",
        fremhaev: "var(--fremhaev)",
        "moerk-flade": "var(--moerk-flade)",
        "moerk-tekst": "var(--moerk-tekst)",
        "moerk-daempet": "var(--moerk-daempet)",
      },
      fontFamily: {
        display: ["var(--font-lora)", "Lora", "serif"],
        sans: ["var(--font-instrument)", "Instrument Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        kort: "18px",
        knap: "14px",
        "knap-sm": "12px",
        pille: "999px",
      },
      boxShadow: {
        loeft: "0 8px 24px rgba(33,27,18,0.10)",
        blod: "0 1px 4px rgba(33,27,18,0.08)",
      },
      letterSpacing: {
        label: "1px",
        "label-bred": "2px",
      },
    },
  },
  plugins: [],
};

export default config;
