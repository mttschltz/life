// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { loose: false, targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
}
