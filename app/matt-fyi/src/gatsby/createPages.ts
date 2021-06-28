import path from 'path'
import type { CreatePagesArgs } from 'gatsby'

interface Edge {
  node: {
    uriPart: string
  }
}

interface Result {
  allRisk: {
    edges: Edge[]
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createPages = ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions
  // Query for markdown nodes to use in creating pages.
  // You can query for whatever data you want to create pages for e.g.
  // products, portfolio items, landing pages, etc.
  // Variables can be added as the second function parameter
  return graphql<Result>(`
    query loadPagesQuery {
      allRisk {
        edges {
          node {
            uriPart
            name
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog post pages.
    result.data?.allRisk.edges.forEach((edge) => {
      createPage({
        // Path for this page — required
        path: `/${edge.node.uriPart}`,
        component: path.resolve('src/pages/risk.tsx'),
        context: {
          uriPart: edge.node.uriPart,
          // Add optional context data to be inserted
          // as props into the page component.
          //
          // The context data can also be used as
          // arguments to the page GraphQL query.
          //
          // The page "path" is always available as a GraphQL
          // argument.
        },
      })
    })
  })
}

export default createPages
