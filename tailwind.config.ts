import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sp-bg': '#181818',
        'sp-surface': '#282828',
        'sp-elevated': '#333333',
        'sp-text': '#cccccc',
        'sp-muted': '#b3b3b3',
        'sp-accent': '#75AADB',
      },
    },
  },
  plugins: [],
}

export default config
