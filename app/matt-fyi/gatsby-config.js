module.exports = {
  siteMetadata: {
    title: 'Matt Schultz',
  },
  plugins: [
    {
      resolve: 'gatsby-source-graphql',
      options: {
        // This type will contain remote schema Query type
        typeName: 'Store',
        // This is the field under which it's accessible
        fieldName: 'store',
        // URL to query from
        url: 'http://localhost:4000',
      },
    },
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        emitSchema: {
          // Used by eslint-plugin-graphql
          'src/__generated__/gatsby-introspection.json': true,
        },
      },
    },
  ],
}
