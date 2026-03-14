import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a3d2e',
          dark: '#072920',
          light: '#0d5540',
        },
        accent: {
          DEFAULT: '#d4af37',
          dark: '#b8952e',
          light: '#e0c566',
        },
        cream: {
          DEFAULT: '#fbf8f3',
          warm: '#fffbf5',
        },
        sage: {
          DEFAULT: '#5c7068',
          light: '#7a8980',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
