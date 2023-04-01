module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'text-2xl',
    'text-3xl',
    {
      pattern: /bg-(red|green|blue|indigo)-(100|200|300|400|500|600|700|800|900)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover'],
    },
  ],
};
