/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#11a92f',
          dark: '#067f2d',
          light: '#25d366',
        },
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'elevated': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}