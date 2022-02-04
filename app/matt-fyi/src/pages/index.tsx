import { Box, Button, Diagram, GatsbyLink, Heading, Stack, Text } from '@component'
import { BoxProps } from '@component/layout/Box'
import { filterNonNullish } from '@matt-fyi/util/graph/graph'
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

const categoryChildrenLayouts = (
  children: Pick<GatsbyTypes.Store_Category, 'id' | 'name'>[],
): { basis: BoxProps['basis']; justify: BoxProps['justify'] }[] => {
  return children.map((_, i) => {
    const numChildren = children.length
    let basis: BoxProps['basis']
    switch (numChildren) {
      case 2:
      case 3:
      case 4:
        basis = `1/${numChildren}`
        break
      default:
        break
    }
    const justify = i === 0 ? 'start' : i === numChildren - 1 ? 'end' : 'center'
    return { basis, justify }
  })
}

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
      <Box direction="column" as="nav" testId="index--category-nav">
        {props.data.store.categories.filter(filterNonNullish).map((rootCategory) => {
          const children = rootCategory.children.filter(filterNonNullish)
          const childrenLayouts = categoryChildrenLayouts(children)
          return (
            <Box
              key={rootCategory.id}
              pad={'large'}
              direction="column"
              background={CATEGORY_NAME_COLOR_MAP[rootCategory.name] ?? 'border'}
            >
              <Stack fill="horizontal">
                <Box direction="column" gap="large">
                  <Box id={`index-category-${rootCategory.id}`} justify="center">
                    <Button
                      href={route.category.detail(rootCategory)}
                      raisePosition={true}
                      testId={`index--category-nav--${rootCategory.id}`}
                    >
                      <Heading level={2} margin="none">
                        {rootCategory.name}
                      </Heading>
                    </Button>
                  </Box>
                  <Box width="100%" justify="between">
                    {children.map((childCategory, index) => (
                      <Box
                        key={childCategory.id}
                        basis={childrenLayouts[index].basis}
                        justify={childrenLayouts[index].justify}
                      >
                        <Box id={`index-category-${childCategory.id}`}>
                          <Button
                            href={route.category.detail(childCategory)}
                            raisePosition={true}
                            size="small"
                            testId={`index--category-nav--${childCategory.id}`}
                          >
                            <Text as="h3">{childCategory.name}</Text>
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Diagram
                  connections={rootCategory.children.filter(filterNonNullish).map((child) => ({
                    fromTarget: `index-category-${rootCategory.id}`,
                    toTarget: `index-category-${child.id}`,
                    thickness: 'xsmall',
                    type: 'rectilinear',
                    anchor: 'vertical',
                    color: 'graph-0',
                  }))}
                />
              </Stack>
            </Box>
          )
        })}
      </Box>
      {!!updates.length && (
        // Markup from here https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
        <Box as="section" testId="index--updates" direction="column">
          <Heading level={2}>{t('page:home.heading_updates')}</Heading>
          {updates.map((u) => (
            <Box as="article" key={u.id} direction="column" pad={{ bottom: 'large' }}>
              <Box align="baseline" justify="between">
                <GatsbyLink to={updatedRoute(u)} testId={`index--updates--update-link--${u.id}`}>
                  <Text as="h3">{u.name}</Text>
                </GatsbyLink>
                <Text size="xsmall">
                  {t('common:date.absolute', {
                    date: new Date(u.updated),
                  })}
                </Text>
              </Box>
              <Text>{u.shortDescription}</Text>
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}

export const query = graphql`
  query CategoryQuery {
    store {
      categories {
        __typename
        id
        name
        path
        children {
          __typename
          id
          name
          path
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
