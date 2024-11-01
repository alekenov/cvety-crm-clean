module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          500: '#4a5568',
          600: '#2d3748',
          700: '#1a202c',
        },
        secondary: {
          500: '#ed64a6',
          600: '#d53f8c',
        }
      }
    },
  },
  plugins: [],
} 