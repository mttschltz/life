import { graphql, PageProps } from 'gatsby'
import * as React from 'react'

const IndexPage: React.FunctionComponent<PageProps<GatsbyTypes.CategoryQueryQuery>> = (props) => {
  return (
    <main>
      Top level categories:
      <ul>
        {props.data.store.categories.map((c, i) => (
          <li key={i}>{c?.name}</li>
        ))}
      </ul>
    </main>
  )
}

export const query = graphql`
  query CategoryQuery {
    store {
      categories {
        name
        children {
          name
        }
      }
    }
  }
`

export default IndexPage
