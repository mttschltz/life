module.exports = {
  ignorePatterns: ['public/**/*', 'src/__generated__/**/*'],
  rules: {
    'import/no-default-export': 'off',
    'import/group-exports': 'off',
  },
  // plugins: ['graphql'],
  // rules: {
  //   'graphql/template-strings': [
  //     'error',
  //     {
  //       env: 'relay',
  //       tagName: 'graphql',
  //       schemaJsonFilepath: path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json'),
  //     },
  //   ],
  // },
}
