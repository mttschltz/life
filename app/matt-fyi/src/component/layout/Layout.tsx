import React from 'react'
import { TranslationProvider, useTranslate } from '@matt-fyi/util/i18n/translate'
import { Box, ThemeProvider, THEME, Header, Heading, Text, Main, Tabs, Tab } from '@component'

const Layout: React.FC = (props) => {
  const t = useTranslate('page')

  return (
    <ThemeProvider theme={THEME}>
      <TranslationProvider>
        <Box width="100%" direction="column" align="center">
          <Box width={{ width: '100%', max: 'large' }} direction="column">
            <Header background="brand" pad="small" align="baseline" direction="row-responsive">
              <Heading level={1} size={'small'}>
                {t('page:home.title')}
              </Heading>
              <Text>{t('page:home.subtitle')}</Text>
            </Header>
            <Box as="nav" align="start" margin={{ vertical: 'medium' }}>
              <Tabs>
                <Tab title={t('page:home.nav_plan')} icon="plan"></Tab>
                <Tab title={t('page:home.nav_action')} icon="checkbox-selected"></Tab>
              </Tabs>
            </Box>
            <Main direction="column">{props.children}</Main>
          </Box>
        </Box>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default Layout
