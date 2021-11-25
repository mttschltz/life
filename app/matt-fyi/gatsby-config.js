module.exports = {
  siteMetadata: {
    title: 'Matt Schultz',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `imagessubfolder`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve(`./plugins/gatsby-remark-image-map`),
          },
        ],
      },
    },
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-image-map`],
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
      },
    },
    'external-mdx',
  ],
}
