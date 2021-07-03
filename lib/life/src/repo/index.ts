import { Result } from 'lib/util'
import { Risk } from 'life/src'

export interface Repo {
  createRisk: (risk: Risk) => Result<void>
  fetchRisk: (id: string) => Result<Risk>
}
