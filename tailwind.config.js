/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // WDS tokens are in CSS Variables, so we extend sparingly
      // Tailwind is used ONLY for layout utilities (flex, grid, spacing shortcuts)
      colors: {
        // Map to CSS variables for consistency
        orange: {
          50: 'var(--color-orange-50)',
          500: 'var(--color-orange-500)',
          600: 'var(--color-orange-600)',
        },
        grey: {
          50: 'var(--color-grey-50)',
          100: 'var(--color-grey-100)',
          300: 'var(--color-grey-300)',
          500: 'var(--color-grey-500)',
          700: 'var(--color-grey-700)',
          900: 'var(--color-grey-900)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  // Disable Tailwind's color utilities - we use CSS Variables instead
  corePlugins: {
    preflight: false, // We have our own reset in global.css
  },
  plugins: [],
}
