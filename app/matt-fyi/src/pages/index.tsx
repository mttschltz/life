import { Box, Button, Diagram, GatsbyLink, Heading, ResponsiveConsumer, Position, Text, Stack } from '@component'
import { BoxProps } from '@component/layout/Box'
import { filterNonNullish } from '@matt-fyi/util/graph/graph'
import { useTranslate } from '@matt-fyi/util/i18n/translate'
import { graphql, PageProps } from 'gatsby'
import * as React from 'react'
import { ReactNode } from 'react'

/* eslint-disable @typescript-eslint/naming-convention */
const CATEGORY_NAME_COLOR_MAP: Record<string, BoxProps['background']> = {
  Health: 'health',
  Wealth: 'wealth',
  Security: 'security',
}
/* eslint-enable @typescript-eslint/naming-convention */

const verticalCategoryChildrenLayouts = (
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

// TODO: Remove once a path field is added to risks
const useRiskRoute = (): { detail: (id: string) => string } => {
  return {
    detail: (id: string): string => `/risk/${id}`,
  }
}

const IndexPage: React.FunctionComponent<PageProps<GatsbyTypes.CategoryQueryQuery>> = (props) => {
  const t = useTranslate('page')
  const updates = props.data.store.updated.filter((u): u is NonNullable<typeof u> => !!u)
  const riskRoute = useRiskRoute()
  const updatedRoute = (updated: NonNullable<GatsbyTypes.CategoryQueryQuery['store']['updated'][number]>): string => {
    let url: string
    switch (updated.__typename) {
      case 'Store_Category':
        url = updated.path
        break
      case 'Store_Risk':
        url = riskRoute.detail(updated.id)
        break
    }
    return url
  }

  return (
    <>
      <Box as="nav" testId="index--category-nav">
        <Stack>
          {props.data.store.categories.filter(filterNonNullish).map((rootCategory) => {
            const children = rootCategory.children.filter(filterNonNullish)
            const verticalChildrenLayouts = verticalCategoryChildrenLayouts(children)

            return (
              <Box
                key={rootCategory.id}
                pad={{ horizontal: 'medium', vertical: 'large' }}
                background={CATEGORY_NAME_COLOR_MAP[rootCategory.name] ?? 'border'}
              >
                <Stack>
                  <ResponsiveConsumer>
                    {(size): ReactNode => (
                      <>
                        {size === 'small' && (
                          <Position fill="horizontal">
                            <Box>
                              <Box basis="1/2" align="center">
                                <Button
                                  id={`index-category-${rootCategory.id}`}
                                  href={rootCategory.path}
                                  raisePosition={true}
                                  testId={`index--category-nav--${rootCategory.id}`}
                                >
                                  <Text as="h2">{rootCategory.name}</Text>
                                </Button>
                              </Box>
                              <Box basis="1/2">
                                <Stack gap="medium">
                                  {children.map((childCategory) => (
                                    <Box key={childCategory.id}>
                                      <Box id={`index-category-${childCategory.id}`}>
                                        <Button
                                          href={childCategory.path}
                                          raisePosition={true}
                                          size="small"
                                          testId={`index--category-nav--${childCategory.id}`}
                                        >
                                          <Text as="h3" size="xsmall">
                                            {childCategory.name}
                                          </Text>
                                        </Button>
                                      </Box>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            </Box>
                            <Diagram
                              connections={rootCategory.children.filter(filterNonNullish).map((child) => ({
                                fromTarget: `index-category-${rootCategory.id}`,
                                toTarget: `index-category-${child.id}`,
                                thickness: 'xsmall',
                                type: 'rectilinear',
                                anchor: 'horizontal',
                                color: 'graph-0',
                              }))}
                            />
                          </Position>
                        )}
                        {size !== 'small' && (
                          <Position fill="horizontal">
                            <Stack gap="large">
                              <Box id={`index-category-${rootCategory.id}`} justify="center">
                                <Button
                                  href={rootCategory.path}
                                  raisePosition={true}
                                  testId={`index--category-nav--${rootCategory.id}`}
                                >
                                  <Heading level={2} margin="none">
                                    {rootCategory.name}
                                  </Heading>
                                </Button>
                              </Box>
                              <Box justify="between">
                                {children.map((childCategory, index) => (
                                  <Box
                                    key={childCategory.id}
                                    basis={verticalChildrenLayouts[index].basis}
                                    justify={verticalChildrenLayouts[index].justify}
                                  >
                                    <Box id={`index-category-${childCategory.id}`}>
                                      <Button
                                        href={childCategory.path}
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
                            </Stack>
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
                          </Position>
                        )}
                      </>
                    )}
                  </ResponsiveConsumer>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>
      {!!updates.length && (
        // Markup from here https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
        <Box as="section" testId="index--updates">
          <Stack>
            <Heading level={2}>{t('page:home.heading_updates')}</Heading>
            {updates.map((u) => (
              <Box as="article" key={u.id} pad={{ bottom: 'large' }}>
                <Stack>
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
                </Stack>
              </Box>
            ))}
          </Stack>
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
