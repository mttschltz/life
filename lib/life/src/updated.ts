import { Identifier } from '@helper/identifier'
import { Category } from './category'
import { Risk } from './risk'

// TODO: When risks are refactored, this should be
// 1. Renamed to something more meaningful, e.g. BlogFeedEntry
// 2. Have ID removed. The feed only needs the path.
interface Updatable {
  readonly id: Identifier
  readonly name: string
  readonly updated: Date
  readonly shortDescription: string
}

type Updated = Category | Risk

function isUpdatedCategory(u: Updated): u is Category {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (u as Category).slug !== undefined
}

function isUpdatedRisk(u: Updated): u is Risk {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return 'impact' in u && 'likelihood' in u && 'category' in u
}

export { isUpdatedCategory, isUpdatedRisk }
export type { Updatable, Updated }
