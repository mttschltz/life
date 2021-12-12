import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      translation: require('../../pages/index_en.json'),
    },
  },
  //   ns: ['common', 'home'],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  //   defaultNS: 'common',
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
