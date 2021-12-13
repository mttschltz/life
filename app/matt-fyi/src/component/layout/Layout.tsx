import React from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import i18n from '@matt-fyi/util/i18n/config'

const Layout: React.FC = (props) => {
  const [t] = useTranslation()

  return (
    <I18nextProvider i18n={i18n}>
      <header>{t('page:home.title')}</header>
      <div>{props.children}</div>
    </I18nextProvider>
  )
}

export default Layout
