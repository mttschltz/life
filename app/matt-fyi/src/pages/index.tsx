import { Box, GatsbyLink, Heading, Text } from '@component'
import { useTranslate } from '@matt-fyi/util/i18n/translate'
import { graphql, PageProps } from 'gatsby'
import * as React from 'react'

const IndexPage: React.FunctionComponent<PageProps<GatsbyTypes.CategoryQueryQuery>> = (props) => {
  const t = useTranslate('page')
  const updates = props.data.store.updated.filter((u): u is NonNullable<typeof u> => !!u)

  return (
    <main>
      Top level categories:
      <ul>
        {props.data.store.categories.map((c, i) => (
          <li key={i}>{c?.name}</li>
        ))}
      </ul>
      {!!updates.length && (
        <>
          <Heading level={2}>{t('page:home.heading_updates')}</Heading>
          {updates.map((u) => (
            <Box key={u.id} direction="column" pad={{ bottom: 'large' }}>
              <GatsbyLink to={`/${u.id}`}>{u.name}</GatsbyLink>
              <Text size="xsmall">{new Date(u.updated).toLocaleDateString('en-US')}</Text>
              <Text>{u.shortDescription}</Text>
            </Box>
          ))}
        </>
      )}
    </main>
  )
}

export const query = graphql`
  query CategoryQuery {
    store {
      categories {
        name
        children {
          name
        }
      }
      updated {
        id
        name
        updated
        shortDescription
      }
    }
  }
`

export default IndexPage
