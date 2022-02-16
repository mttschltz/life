import { Identifier } from '@helper/identifier'
import { Category } from './category'
import { Risk } from './risk'

interface Updatable {
  id: Identifier
  name: string
  updated: Date
  shortDescription: string
}

type Updated = Category | Risk

function isUpdatedCategory(u: Updated): u is Category {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (u as Category).path !== undefined
}

function isUpdatedRisk(u: Updated): u is Risk {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return 'impact' in u && 'likelihood' in u && 'category' in u
}

export { isUpdatedCategory, isUpdatedRisk }
export type { Updatable, Updated }
