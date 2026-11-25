/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mat: {
          canvas: '#F4F1E8',
          forest: '#00332A',
          cutting: '#0E5B44',
          'cutting-dark': '#0B4A37',
          grid: '#C4DE6E',
          olive: '#2E4732',
          sage: '#687E6C',
        },
        canvas: {
          oatmeal: '#F4F1E8',
          cream: '#FAF8F5',
        },
        card: {
          linen: '#FFFFFF',
          subtle: '#F4EFE6',
        },
        border: {
          subtle: '#E8E1D5',
          light: '#E7E5E4',
        },
        ink: {
          espresso: '#1C1917',
          muted: '#78716C',
        },
        burnt: {
          caramel: '#D97706',
          deep: '#B45309',
        },
        butter: {
          cream: '#FEF3C7',
        },
        kraft: {
          paper: '#D7C4B7',
        },
        sage: {
          accent: '#84907E',
        },
        status: {
          danger: '#B91C1C',
          'danger-strong': '#991B1B',
        },
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        sheet: 'var(--radius-sheet)',
      },
      scale: {
        tactile: '0.97',
      },
      fontFamily: {
        display: ['Nunito', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'Courier Prime', 'monospace'],
        hand: ['Caveat', 'cursive'],
        serif: ['Nunito', 'Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        float: '0 12px 32px -4px rgba(28, 25, 23, 0.12), 0 4px 12px -2px rgba(28, 25, 23, 0.06)',
      },
    },
  },
  plugins: [],
};
