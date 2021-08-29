import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { FunctionComponent } from 'react'

const IndexPage: FunctionComponent<PageProps<GatsbyTypes.RisksQueryQuery>> = ({ data }): JSX.Element => {
  return (
    <main>
      {data.store.risks.map((r) => (
        <>
          <p key={r?.id}>Risk: {r?.id}</p>
          <ul>
            <li>Name: {r?.name}</li>
            <li>Notes: {r?.notes}</li>
            <li>
              Children ({r?.children?.length}):{' '}
              {r?.children?.length && (
                <ul>
                  {r.children.map((c) => (
                    <>
                      <p key={c?.id}>Risk: {c?.id}</p>
                      <ul key={c?.id}>
                        <li>name: {c?.name}</li>
                        <li>notes: {c?.notes}</li>
                      </ul>
                    </>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </>
      ))}
    </main>
  )
}

export const query = graphql`
  query RisksQuery {
    store {
      risks {
        id
        name
        notes
        children {
          id
          name
          category
          notes
        }
      }
    }
  }
`
export default IndexPage
