import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FunctionComponent } from 'react'
import { MDXProvider } from '@mdx-js/react'

interface RiskPageContext {
  id: string
}

const IndexPage: FunctionComponent<PageProps<GatsbyTypes.RisksQueryQuery, RiskPageContext>> = (props): JSX.Element => {
  const data = props.data
  const context = props.pageContext
  return (
    <>
      <MDXProvider components={{}}>
        {data.store.risks
          .filter((r): r is NonNullable<typeof r> => r?.id === context.id)
          .map((r) => (
            <>
              <p key={r.id}>Risk: {r.id}</p>
              <ul>
                <li>Name: {r.name}</li>
                <li>Notes: {r.notes && <MDXRenderer>{r.notes}</MDXRenderer>}</li>
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

export type { RiskPageContext }

export default IndexPage
