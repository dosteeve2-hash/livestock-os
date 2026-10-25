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
        paper: '#F3EDDF',
        'paper-light': '#FBF8F0',
        'paper-deep': '#E7DDCA',
        ink: '#30281F',
        'ink-soft': '#5D5347',
        leather: '#493729',
        'leather-deep': '#2B241D',
        ochre: '#875319',
        'ochre-bright': '#C28B42',
        sage: '#365744',
        brick: '#8C4638',
        navy: '#0A1628',
        gold: '#D4AF37',
        cyan: '#00BCD4',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Aptos', 'Segoe UI', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
