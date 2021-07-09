import path from 'path'
import type { CreatePagesArgs } from 'gatsby'

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
  return graphql<Result>(`
    {
      store {
        risks {
          id
          name
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog post pages.
    const risk = result.data?.store.risks[0]
    console.log(`!!result.data=${JSON.stringify(result.data)}`)
    console.log(`!!risk=${JSON.stringify(risk)}`)
    if (!risk) {
      console.log('no risk')
    } else {
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
