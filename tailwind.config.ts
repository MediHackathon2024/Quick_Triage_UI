import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        gradientFlow: 'gradientFlow 10s ease infinite',
      },
      backgroundImage: {
        'dynamic-gradient': 'linear-gradient(90deg, #404089, #000000)',
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};
export default config;
