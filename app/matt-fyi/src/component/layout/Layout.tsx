import React from 'react'
import { TranslationProvider, useTranslate } from '@matt-fyi/util/i18n/translate'
import { Box, ThemeProvider, THEME } from '@component'

const Layout: React.FC = (props) => {
  const t = useTranslate('page')

  return (
    <ThemeProvider theme={THEME}>
      <TranslationProvider>
        <Box width="100%" justify="between">
          <Box>{t('page:home.title')}</Box>
          <Box>{t('page:home.subtitle')}</Box>
        </Box>
        <div>{props.children}</div>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default Layout
