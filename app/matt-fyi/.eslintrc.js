/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  ignorePatterns: ['public/**/*'],
  plugins: ['graphql'],
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'relay',
        tagName: 'graphql',
        schemaJsonFilepath: path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json'),
      },
    ],
  },
}
