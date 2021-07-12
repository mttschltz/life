import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client'
import fetch from 'cross-fetch'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000', fetch }),
  cache: new InMemoryCache(),
})

client
  .query({
    query: gql`
      query GetRisks {
        risks {
          id
          name
        }
      }
    `,
  })
  .then((result) => console.log(JSON.stringify(result)))
