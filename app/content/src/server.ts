import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core'
import fetch from 'cross-fetch'
import { CreateRiskMutationVariables, CreateRiskMutation } from './__generated__/CreateRiskMutation'
import { Category } from './__generated__/globalTypes'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000', fetch }),
  cache: new InMemoryCache(),
})

const createRiskMutation = gql`
  mutation CreateRiskMutation($input: CreateRiskInput!) {
    createRisk(input: $input) {
      id
    }
  }
`

client
  .mutate<CreateRiskMutation, CreateRiskMutationVariables>({
    mutation: createRiskMutation,
    variables: {
      input: {
        name: 'risk parent',
        category: Category.HEALTH,
        uriPart: '/uri-part-risk-parent',
      },
    },
  })
  .then((result) => console.log(JSON.stringify(result)))
  .catch((e) => console.log(`error=${e}`))

client
  .mutate<CreateRiskMutation, CreateRiskMutationVariables>({
    mutation: createRiskMutation,
    variables: {
      input: {
        category: Category.SECURITY,
        name: 'risk child',
        uriPart: '/uri-part-risk-child',
        parentId: '/uri-part-risk-parent',
      },
    },
  })
  .then((result) => console.log(JSON.stringify(result)))
  .catch((e) => console.log(`error=${e}`))
