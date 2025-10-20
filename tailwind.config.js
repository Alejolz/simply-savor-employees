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
      backgroundImage: {
        // Gradientes base que ya tienes
        'gradient-primary': 'linear-gradient(to right, #25d366, #067f2d)',
        'gradient-success': 'linear-gradient(to right, #28a745, #218838)',
        'gradient-warning': 'linear-gradient(to right, #ffc107, #e0a800)',
        'gradient-danger': 'linear-gradient(to right, #dc3545, #a71d2a)',

        // Extras para más variedad
        'gradient-indigo': 'linear-gradient(to right, #6366F1, #4338CA)',
        'gradient-rose': 'linear-gradient(to right, #F43F5E, #BE123C)',
        'gradient-teal': 'linear-gradient(to right, #14B8A6, #0D9488)',
        'gradient-cyan': 'linear-gradient(to right, #06B6D4, #0891B2)',
        'gradient-emerald': 'linear-gradient(to right, #10B981, #047857)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
