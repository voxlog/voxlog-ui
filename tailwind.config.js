// Configure tailwind.css in the project root to override these defaults
module.exports = {
  content: ['./src/pages/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // media or class
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        nerd: ['var(--firanerd)', 'monospace'],
      },

      backgroundImage: (theme) => ({
        'drums-bg': "url('/images/instruments/drums.png')",
        'guitar-bg': "url('/images/instruments/guitar.png')",
        'guitar2-bg': "url('/images/instruments/guitar_2.png')",
        'piano-bg': "url('/images/instruments/piano.png')",
      }),
    },
  },

  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          '@screen sm': {
            maxWidth: '100%',
          },
          '@screen md': {
            maxWidth: '768px',
          },
          '@screen lg': {
            maxWidth: '768px',
          },
          '@screen xl': {
            maxWidth: '1024px',
          },
        },
      });
    },
  ],
};
