import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client'
import fetch from 'cross-fetch'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000', fetch }),
  cache: new InMemoryCache(),
})

client
  .mutate({
    mutation: gql`
      mutation CreateRisk($input: CreateRiskInput!) {
        createRisk(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        category: 'HEALTH',
        name: 'risk1',
        uriPart: '/uri-part-riskxxxx',
      },
    },
  })
  .then((result) => console.log(JSON.stringify(result)))
  .catch((e) => console.log(`error=${e}`))
