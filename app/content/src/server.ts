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
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async function (): Promise<void> {
  try {
    const parent = await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          name: 'risk parent',
          category: Category.HEALTH,
          uriPart: 'uri-part-risk-parent',
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: Category.SECURITY,
          name: 'risk child',
          uriPart: 'uri-part-risk-child',
          parentId: parent.data?.createRisk.id,
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: Category.SECURITY,
          name: 'risk child 2',
          uriPart: 'uri-part-risk-child-2',
          parentId: parent.data?.createRisk.id,
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: Category.WEALTH,
          name: 'risk paent 2',
          uriPart: 'uri-part-risk-parent-2',
        },
      },
    })
  } catch (e: unknown) {
    console.log(`error=${JSON.stringify(e)}`)
    process.exitCode = 1
    throw new Error(JSON.stringify(e))
  }
})()
