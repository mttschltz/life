/* eslint-disable react/prop-types */
import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { FunctionComponent } from 'react'

type UserByID = {
  store: {
    risks: {
      id: string
      name: string
    }[]
  }
}

type RiskPageProps = PageProps<UserByID>

const IndexPage: FunctionComponent<RiskPageProps> = ({ data }): JSX.Element => {
  return (
    <main>
      {data.store?.risks?.map((r) => (
        <p key={r.id}>Risk: {r.id}</p>
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
      }
    }
  }
`
export default IndexPage
