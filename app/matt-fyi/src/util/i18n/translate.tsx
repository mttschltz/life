import React from 'react'
import { I18nextProvider, TFunction, useTranslation } from 'react-i18next'
import { i18n, resources } from './config'

type Namespace = Exclude<keyof typeof resources['en'], 'common'>

const useTranslate = <T extends Namespace>(x: T): TFunction<(T | 'common')[]> => {
  const [t] = useTranslation([x, 'common'])
  return t
}

const TranslationProvider: React.FC = (props) => {
  return <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
}

export { TranslationProvider, useTranslate }
