import path from 'path'
import type { CreatePagesArgs } from 'gatsby'
import { gql } from '@apollo/client/core'
import { print } from 'graphql'
import { RiskPageContext } from '@matt-fyi/templates/risk'

// Use these types rather than GatsbyTypes, which aren't available at this point on a clean build.
// GatsbyTypes are built by gatsby-plugin-typegen on build.
interface Risk {
  id: string
}
interface Result {
  store: {
    risks: Risk[]
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createPages = async ({ graphql, actions }: CreatePagesArgs): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { createPage, createRedirect } = actions
  // Query for markdown nodes to use in creating pages.
  // You can query for whatever data you want to create pages for e.g.
  // products, portfolio items, landing pages, etc.
  // Variables can be added as the second function parameter

  // Use gql for Intellisense then convert to string for graphql function using
  // GraphQL's print function.
  const queryRisks = gql`
    query StoreQuery {
      store {
        risks {
          id
          parent {
            id
          }
        }
      }
    }
  `
  return graphql<Result>(print(queryRisks)).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog post pages.
    const risks = result.data?.store.risks ?? []
    for (const risk of risks) {
      createRedirect({
        fromPath: `/${risk.id}-redirect`,
        toPath: `/${risk.id}`,
        isPermanent: true,
      })
      createPage<RiskPageContext>({
        // Path for this page — required
        path: `/${risk.id}`,
        component: path.resolve('src/templates/risk.tsx'),
        context: {
          id: risk.id,
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
    }
  })
}

export default createPages
