/* eslint-disable react/prop-types */
import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { FunctionComponent } from 'react'

type RiskPageProps = PageProps<GatsbyTypes.RiskByPathQuery>

const IndexPage: FunctionComponent<RiskPageProps> = ({ data }): JSX.Element => {
  return <main>Risk: {data.risk?.uriPart}</main>
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
