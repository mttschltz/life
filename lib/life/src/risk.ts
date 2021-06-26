import { Mitigation } from '@life/mitigation'
import { IsArray, IsEnum, IsOptional, MinLength, validateSync } from 'class-validator'

export enum RiskType {
  Risk = 'Risk',
  Goal = 'Goal',
  Condition = 'Condition',
}

export enum Impact {
  High = 'High',
  Normal = 'Normal',
}

export enum Likelihood {
  High = 'High',
  Normal = 'Normal',
}

export enum Category {
  Health = 'Category',
  Wealth = 'Wealth',
  Security = 'Security',
}

class Result<T> {
  public readonly errorMessage?: string
  public readonly isSuccess: boolean
  private readonly value?: T

  private constructor(isSuccess: boolean, errorMessage?: string, value?: T) {
    if (isSuccess && (value == null || errorMessage)) {
      throw new Error('Success results must have a value and no error message')
    }

    if (!isSuccess && (value != null || !errorMessage)) {
      throw new Error('Error results must have an error message and no value')
    }

    this.errorMessage = errorMessage
    this.isSuccess = isSuccess
    this.value = value
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of an error result')
    }
    if (!this.value) {
      throw new Error('Missing value for success result')
    }
    return this.value
  }

  getErrorMessage(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error message of a success result')
    }
    if (!this.errorMessage) {
      throw new Error('Missing error message for error result')
    }
    return this.errorMessage
  }

  public static success<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  public static error<U>(errorMessage: string): Result<U> {
    return new Result<U>(true, errorMessage)
  }
}

type CreateDetails = Pick<Risk, 'category' | 'impact' | 'likelihood' | 'name' | 'notes' | 'parent' | 'type'>

export interface Loader {
  loadMitigations: (id: string) => Mitigation[]
}

// TODO: Implements reviewable?
export class Risk {
  #id?: string

  #category: Category
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

  private constructor(
    { category, impact, likelihood, name, notes, parent, type }: CreateDetails,
    loader: Loader,
    id?: string,
  ) {
    this.#id = id

    this.#category = category
    this.#impact = impact
    this.#likelihood = likelihood
    this.#name = name
    this.#notes = notes
    this.#parent = parent
    this.#type = type

    this.#mitigations = undefined

    this.#loader = loader
  }

  @IsOptional()
  get id(): string | undefined {
    return this.#id
  }

  // details

  @IsEnum(Category)
  get category(): Category {
    return this.#category
  }

  @IsEnum(Impact)
  get impact(): Impact {
    return this.#impact
  }

  @IsEnum(Likelihood)
  get likelihood(): Likelihood {
    return this.#likelihood
  }

  @MinLength(1)
  get name(): string {
    return this.#name
  }

  @IsOptional()
  get notes(): string {
    return this.#notes
  }

  @IsOptional()
  get parent(): Risk | undefined {
    return this.#parent // TODO: How to get this?
  }

  @IsEnum(RiskType)
  get type(): RiskType {
    return this.#type
  }

  @IsArray()
  get mitigations(): Mitigation[] {
    if (!this.#id) {
      return []
    }

    if (!this.#mitigations) {
      this.#mitigations = this.#loader.loadMitigations(this.#id)

      if (!this.#mitigations) {
        throw new Error('error loading mitigations')
      }
    }
    return this.#mitigations
  }

  static create(details: CreateDetails): Result<Risk> {
    if (!details) {
      return Result.error('Missing details')
    }

    const risk = new Risk(
      details,
      {
        loadMitigations: () => [], // TODO:
      },
      undefined,
    )

    const errors = validateSync(risk)
    if (errors.length > 0) {
      const constraints = errors[0].constraints
      if (!constraints) {
        return Result.error('Validation failed')
      }
      return Result.error(Object.values(constraints)[0])
    }

    return Result.success(risk)
  }
}
