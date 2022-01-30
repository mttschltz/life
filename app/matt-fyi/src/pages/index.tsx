import { Box, GatsbyLink, Heading, Text } from '@component'
import { BoxProps } from '@component/layout/Box'
import { useTranslate } from '@matt-fyi/util/i18n/translate'
import { useRoute } from '@matt-fyi/util/route/route'
import { graphql, PageProps } from 'gatsby'
import * as React from 'react'

/* eslint-disable @typescript-eslint/naming-convention */
const CATEGORY_NAME_COLOR_MAP: Record<string, BoxProps['background']> = {
  Health: 'health',
  Wealth: 'wealth',
  Security: 'security',
}
/* eslint-enable @typescript-eslint/naming-convention */

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
      <Box direction="column">
        {props.data.store.categories
          .filter((c): c is NonNullable<typeof c> => !!c)
          .map((c) => (
            <Box
              key={c.id}
              align="center"
              justify="center"
              height={{ min: 'xsmall' }}
              background={CATEGORY_NAME_COLOR_MAP[c.name] ?? 'border'}
            >
              {c.name}
            </Box>
          ))}
      </Box>
      {!!updates.length && (
        <>
          <Heading level={2}>{t('page:home.heading_updates')}</Heading>
          {updates.map((u) => (
            <Box key={u.id} direction="column" pad={{ bottom: 'large' }}>
              <Box align="baseline" justify="between">
                <GatsbyLink to={updatedRoute(u)}>{u.name}</GatsbyLink>
                <Text size="xsmall">
                  {t('common:date.absolute', {
                    date: new Date(u.updated),
                  })}
                </Text>
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
        id
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
