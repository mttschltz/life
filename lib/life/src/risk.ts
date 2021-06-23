import { Mitigation } from '@life/mitigation'

type RiskType = 'risk' | 'goal' | 'condition'
type Impact = 'high' | 'normal'
type Likelihood = 'high' | 'normal'

// TODO: Maybe each entity should implement this in a way that relations can be called and loaded
// interface Loadable<T> {
//   isLoaded: boolean
//   Load: () => T
// }

interface NewDetails {
  name: string
  type: RiskType
  impact: Impact
  likelihood: Likelihood
  notes: string
  parent?: Risk
}

export interface Loader {
  loadMitigations: (id: string) => Mitigation[]
}

// TODO: Implements reviewable?
export class Risk {
  #id: string

  #impact: Impact
  #likelihood: Likelihood
  #name: string
  #notes: string
  #parent?: Risk
  #type: RiskType

  // relationships
  #mitigations?: Mitigation[]

  #loader: Loader

  // TODO:
  // ready or not ready? maybe a part of reviewable? i.e. when added it's not 'approved'... eventually it is... then reviewable sets it to be checked again.

  constructor(id: string, { impact, likelihood, name, notes, parent, type }: NewDetails, loader: Loader) {
    this.#id = id

    this.#impact = impact
    this.#likelihood = likelihood
    this.#name = name
    this.#notes = notes
    this.#parent = parent
    this.#type = type

    this.#mitigations = undefined

    this.#loader = loader
  }

  get id(): string {
    return this.#id
  }

  // details

  get impact(): Impact {
    return this.#impact
  }

  get likelihood(): Likelihood {
    return this.#likelihood
  }

  get name(): string {
    return this.#name
  }

  get notes(): string {
    return this.#notes
  }

  get parent(): Risk | undefined {
    return this.#parent // TODO: How to get this?
  }

  get type(): RiskType {
    return this.#type
  }

  // relations

  get mitigations(): Mitigation[] {
    if (!this.#mitigations) {
      this.#mitigations = this.#loader.loadMitigations(this.#id)

      if (!this.#mitigations) {
        throw new Error('error loading mitigations')
      }
    }
    return this.#mitigations
  }
}
