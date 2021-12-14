// babel.config.js
module.exports = {
  // Why tests@babel/preset-typescript is needed here:
  // Netlify is setup with basedir of app/matt-fyi but we want to run unit tests on build from
  // the root directly. So we run jest pointing to the root directory config but it then picks
  // up this babel config. For jest to pick up typescript, this preset is needed.
  presets: [
    ['babel-preset-gatsby'],
    ['@babel/preset-env', { loose: false }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    // Disable loose mode for these 3 plugins to prevent warnings during build
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ['@babel/plugin-proposal-private-methods', { loose: false }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: false }],
  ],
}
