const path = require('path');

module.exports = {
  style: {
    postcss: {
      mode: 'file',
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: {
      resolve: {
        fallback: {
          path: false,
          os: false,
        },
      },
    },
  },
};
