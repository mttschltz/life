import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: {
      // import() isn't working here, even with resolveJsonModule enabled in tsconfig.json
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      component: require('@matt-fyi/component/component_en.json'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      page: require('@matt-fyi/pages/page_en.json'),
      common: {},
    },
  },
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
