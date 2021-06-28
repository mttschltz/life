/* eslint-disable react/prop-types */
import * as React from 'react'
import { graphql } from 'gatsby'
import { FunctionComponent } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,react/prop-types
const IndexPage: FunctionComponent<{
  data: {
    risk: {
      uriPart: string
    }
  }
}> = ({ data }): JSX.Element => {
  return <main>Risk: {data.risk.uriPart}</main>
}

export const query = graphql`
  query RiskByPath($uriPart: String!) {
    risk(uriPart: { eq: $uriPart }) {
      uriPart
      name
    }
  }
`
export default IndexPage
