import { Box, GatsbyLink, Heading, Text } from '@component'
import { useTranslate } from '@matt-fyi/util/i18n/translate'
import { useRoute } from '@matt-fyi/util/route/route'
import { graphql, PageProps } from 'gatsby'
import * as React from 'react'

const IndexPage: React.FunctionComponent<PageProps<GatsbyTypes.CategoryQueryQuery>> = (props) => {
  const t = useTranslate('page')
  const updates = props.data.store.updated.filter((u): u is NonNullable<typeof u> => !!u)
  const route = useRoute()
  const updatedRoute = (updated: NonNullable<GatsbyTypes.CategoryQueryQuery['store']['updated'][number]>): string => {
    let path: string
    switch (updated.__typename) {
      case 'Store_Category':
        path = route.category.detail(updated)
        break
      case 'Store_Risk':
        path = route.risk.detail(updated)
        break
    }
    return path
  }

  return (
    <>
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
              <Box align="baseline" justify="between">
                <GatsbyLink to={updatedRoute(u)}>{u.name}</GatsbyLink>
                <Text size="xsmall">{t('common:date.absolute', { date: new Date(u.updated) })}</Text>
              </Box>
              <Text>{u.shortDescription}</Text>
            </Box>
          ))}
        </>
      )}
    </>
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
        __typename
        id
        name
        updated
        shortDescription
        ... on Store_Category {
          path
        }
      }
    }
  }
`

export default IndexPage
