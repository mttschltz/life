import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core'
import fetch from 'cross-fetch'
import { CreateRiskMutationVariables, CreateRiskMutation } from './__generated__/CreateRiskMutation'
import { CategoryTopLevel } from './__generated__/globalTypes'

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
          category: CategoryTopLevel.HEALTH,
          uriPart: 'uri-part-risk-parent',
          notes: `
# Heading

<p>Here's a <a href="https://www.google.com">link</a></p>
          `.trim(),
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: CategoryTopLevel.SECURITY,
          name: 'risk child',
          uriPart: 'uri-part-risk-child',
          parentId: parent.data?.createRisk.id,
          notes: `
# Heading

<p>Here's a <a href="https://www.google.com">link</a></p>
          `.trim(),
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: CategoryTopLevel.SECURITY,
          name: 'risk child 2',
          uriPart: 'uri-part-risk-child-2',
          parentId: parent.data?.createRisk.id,
          notes: `
# Heading

<p>Here's a <a href="https://www.google.com">link</a></p>
          `.trim(),
        },
      },
    })

    await client.mutate<CreateRiskMutation, CreateRiskMutationVariables>({
      mutation: createRiskMutation,
      variables: {
        input: {
          category: CategoryTopLevel.WEALTH,
          name: 'risk paent 2',
          uriPart: 'uri-part-risk-parent-2',
          notes: `
# Heading

<p>Here's a <a href="https://www.google.com">link</a></p>
          `.trim(),
        },
      },
    })
  } catch (e: unknown) {
    console.log(`error=${JSON.stringify(e)}`)
    process.exitCode = 1
    throw new Error(JSON.stringify(e))
  }
})()
