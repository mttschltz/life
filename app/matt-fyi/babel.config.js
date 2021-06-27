// babel.config.js
module.exports = {
  // Why tests@babel/preset-typescript is needed here:
  // Netlify is setup with basedir of app/matt-fyi but we want to run unit tests on build from
  // the root directly. So we run jest pointing to the root directory config but it then picks
  // up this babel config. For jest to pick up typescript, this preset is needed.
  presets: [['babel-preset-gatsby'], '@babel/preset-typescript'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
}
