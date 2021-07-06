/* eslint-disable react/prop-types */
import * as React from 'react'
import { graphql } from 'gatsby'
import type { PageProps } from 'gatsby'
import { FunctionComponent } from 'react'

type UserByID = {
  test: {
    post: {
      id: string
      title: string
      content: string
    }
  }
}

type RiskPageProps = PageProps<UserByID>

const IndexPage: FunctionComponent<RiskPageProps> = ({ data }): JSX.Element => {
  return <main>Post: {data.test.post.id}</main>
}

export const query = graphql`
  query PostByID($id: ID!) {
    test {
      post(id: $id) {
        id
        title
        content
      }
    }
  }
`
export default IndexPage
