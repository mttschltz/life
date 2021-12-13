/* eslint-disable @typescript-eslint/naming-convention */
import { resources, defaultNamespace } from '@matt-fyi/util/i18n/config'

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNamespace
    resources: typeof resources['en']
  }
}

/* eslint-enable @typescript-eslint/naming-convention */
