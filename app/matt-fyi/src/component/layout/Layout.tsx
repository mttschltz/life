import React from 'react'
import { TranslationProvider, useTranslate } from '@matt-fyi/util/i18n/translate'
import { useRoute } from '@matt-fyi/util/route/route'
import { Box, ThemeProvider, THEME, Header, Heading, Text, Main, Tabs, Tab, Stack } from '@component'
import { filterNonNullish } from '@matt-fyi/util/graph/graph'

const Layout: React.FC = (props) => {
  const t = useTranslate('page')

  // Hack: These calls fix hot reload in development. If imports in index.tsx (and likely other
  // files) aren't also imported in this file, then hot reload does not work. https://github.com/mttschltz/life/issues/14
  useRoute()
  filterNonNullish({})

  return (
    <ThemeProvider theme={THEME}>
      <TranslationProvider>
        <Box justify="center">
          <Box width={{ width: '100%', max: 'large' }}>
            <Stack>
              <Header background="brand" pad="small" align="baseline" direction="row-responsive">
                <Heading level={1}>{t('page:home.title')}</Heading>
                <Text>{t('page:home.subtitle')}</Text>
              </Header>
              <Box as="nav" align="start" margin={{ vertical: 'medium' }}>
                <Tabs>
                  <Tab title={t('page:home.nav_plan')} icon="plan" testId="layout--nav--tab--plan"></Tab>
                  <Tab
                    title={t('page:home.nav_action')}
                    icon="checkbox-selected"
                    testId="layout--nav--tab--action"
                  ></Tab>
                </Tabs>
              </Box>
              <Main direction="column">{props.children}</Main>
            </Stack>
          </Box>
        </Box>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default Layout
