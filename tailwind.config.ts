import { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        lg: "80px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
    },
  },
} satisfies Config;
