import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import component from '@matt-fyi/component/component_en.json'
import page from '@matt-fyi/pages/page_en.json'
import common from '@matt-fyi/component/common_en.json'

const resources = {
  en: {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    component,
    page,
    common,
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  },
} as const

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  resources,
  returnObjects: true,
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already handles this
  },
  react: {
    wait: true,
    useSuspense: false,
  },
})

i18n.languages = ['en']

export default i18n
export { resources }
