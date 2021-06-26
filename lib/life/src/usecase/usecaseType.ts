import { Risk as RiskEntity } from '@life/risk'

export type Risk = Pick<
  RiskEntity,
  'id' | 'category' | 'impact' | 'likelihood' | 'mitigations' | 'name' | 'notes' | 'parent' | 'type'
>
