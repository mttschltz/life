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
        outputPath: `src/__generated__/gatsby-types.d.ts`, // Needs to be .d.ts otherwise it won't pass isolatedModules rule
        emitSchema: {
          // Used by eslint-plugin-graphql
          'src/__generated__/gatsby-introspection.json': true,
        },
        scalars: {
          Store_Date: 'string',
        },
      },
    },
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: `${__dirname}/src/component/layout/Layout.tsx`,
      },
    },
  ],
}
