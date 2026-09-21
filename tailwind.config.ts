import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      maxWidth: { content: "48rem" },
    },
  },
  plugins: [],
};

export default config;
