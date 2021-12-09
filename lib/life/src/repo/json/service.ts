// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CategoryJson, RiskJson } from '@life/repo/json/mapper'

interface JsonStore {
  risk: {
    [key: string]: RiskJson
  }
  category: {
    [key: string]: CategoryJson
  }
}

export type { JsonStore }
