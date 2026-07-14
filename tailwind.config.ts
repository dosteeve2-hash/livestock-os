import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        gold: '#D4AF37',
        cyan: '#00BCD4',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0A1628 0%, #1a2d4d 100%)',
      },
    },
  },
  plugins: [],
}

export default config
