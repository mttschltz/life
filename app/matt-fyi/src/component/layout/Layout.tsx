import React from 'react'
import { TranslationProvider, useTranslate } from '@matt-fyi/util/i18n/translate'
import { Box, ThemeProvider, THEME, Header, Heading, Text, Main } from '@component'

const Layout: React.FC = (props) => {
  const t = useTranslate('page')

  return (
    <ThemeProvider theme={THEME}>
      <TranslationProvider>
        <Box width="100%" direction="column" align="center">
          <Box width={{ width: '100%', max: 'large' }} direction="column">
            <Header background="brand" pad="small" align="baseline">
              <Heading level={1}>{t('page:home.title')}</Heading>
              <Text>{t('page:home.subtitle')}</Text>
            </Header>
            <Main direction="column">{props.children}</Main>
          </Box>
        </Box>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default Layout
