module.exports = {
  ignorePatterns: ['public/**/*'],
  rules: {
    'import/no-default-export': 0,
    'import/group-exports': 0,
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
