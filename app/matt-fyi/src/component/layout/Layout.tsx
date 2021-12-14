import React from 'react'
import { TranslationProvider, useTranslate } from '@matt-fyi/util/i18n/translate'

const Layout: React.FC = (props) => {
  const t = useTranslate('page')

  return (
    <TranslationProvider>
      <header>{t('page:home.title')}</header>
      <div>{props.children}</div>
    </TranslationProvider>
  )
}

export default Layout
