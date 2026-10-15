import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B2B3A',
        paper: '#F5F8F6',
        mist: '#DCEBE6',
        kowhai: '#F5B700',
        fern: '#1B6B4F',
        pohutukawa: '#B3261E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
