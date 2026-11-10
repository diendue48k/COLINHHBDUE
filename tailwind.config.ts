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
        sans: [
          'var(--font-svn-gilroy)',
          '"SVN-Gilroy"',
          '"SVN-Griloy"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        gilroy: [
          'var(--font-svn-gilroy)',
          '"SVN-Gilroy"',
          '"SVN-Griloy"',
          'sans-serif',
        ],
      },
      colors: {
        due: {
          blue: "#0F52BA",
          darkBlue: "#0B2545",
          navy: "#003366",
          lightBlue: "#E8F1FC",
          sky: "#0288D1",
          orange: "#FA541C",
          amber: "#FF7A00",
          yellow: "#FA8C16",
          green: "#10B981",
          darkGreen: "#1B5E20",
          grayBg: "#F4F7FB",
          cardBorder: "#E2E8F0"
        }
      },
      boxShadow: {
        'portal': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;
