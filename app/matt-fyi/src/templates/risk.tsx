import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FunctionComponent } from 'react'
import { MDXProvider } from '@mdx-js/react'

const IndexPage: FunctionComponent<PageProps<GatsbyTypes.RisksQueryQuery>> = ({ data }): JSX.Element => {
  return (
    <>
      <MDXProvider components={{}}>
        {data.store.risks.map((r) => (
          <>
            <p key={r?.id}>Risk: {r?.id}</p>
            <ul>
              <li>Name: {r?.name}</li>
              <li>Notes: {r?.notes && <MDXRenderer>{r.notes}</MDXRenderer>}</li>
              <li></li>
            </ul>
          </>
        ))}
      </MDXProvider>
    </>
  )
}

export const query = graphql`
  query RisksQuery {
    store {
      risks {
        id
        name
        notes
      }
    }
  }
`
export default IndexPage
