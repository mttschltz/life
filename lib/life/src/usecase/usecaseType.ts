import { Risk as RiskEntity } from '@life/risk'

export type Risk = Pick<
  RiskEntity,
  'id' | 'impact' | 'likelihood' | 'mitigations' | 'name' | 'notes' | 'parent' | 'type'
>
