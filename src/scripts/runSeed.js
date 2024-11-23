require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs'],
    ['@babel/plugin-transform-runtime']
  ]
});

require('./seedProducts');
