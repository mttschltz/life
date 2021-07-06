import path from 'path'
import type { CreatePagesArgs } from 'gatsby'

interface Edge {
  id: string
}

interface Result {
  test: {
    post: Edge
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
    query LoadPagesQuery {
      test {
        post(id: "test") {
          title
          id
          content
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog post pages.
    const post = result.data?.test.post
    console.log(`!!post=${JSON.stringify(post)}`)
    if (!post) {
      console.log('no post')
    } else {
      createPage({
        // Path for this page — required
        path: `/post`,
        component: path.resolve('src/templates/risk.tsx'),
        context: {
          id: post.id,
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
