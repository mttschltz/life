import path from 'path'
import type { CreatePagesArgs } from 'gatsby'
import { gql } from '@apollo/client/core'
import { print } from 'graphql'

// TODO: Use real Risk
interface Risk {
  id: string
}

interface Result {
  store: {
    risks: Risk[]
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createPages = ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions
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
          name
        }
      }
    }
  `
  return graphql<Result>(print(queryRisks)).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog post pages.
    const risk = result.data?.store.risks[0]
    if (risk) {
      createPage({
        // Path for this page — required
        path: `/risk`,
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
