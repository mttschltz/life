import { IsEnum, IsOptional, IsString, MinLength, validateSync } from 'class-validator'
import { Result } from '@util'

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

export type CreateDetails = Pick<Risk, 'category' | 'impact' | 'likelihood' | 'name' | 'notes' | 'parent' | 'type'>

export class Risk {
  #id: string

  #category: Category
  #impact: Impact
  #likelihood: Likelihood

  #name: string
  #notes?: string
  #parent?: Risk
  #type: RiskType

  private constructor({ category, impact, likelihood, name, notes, parent, type }: CreateDetails, id: string) {
    this.#id = id

    this.#category = category
    this.#impact = impact
    this.#likelihood = likelihood
    this.#name = name
    this.#notes = notes
    this.#parent = parent
    this.#type = type
  }

  @IsOptional()
  get id(): string {
    return this.#id
  }

  // Details

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
  @IsString()
  get name(): string {
    return this.#name
  }

  @IsOptional()
  @IsString()
  get notes(): string | undefined {
    return this.#notes
  }

  @IsOptional()
  get parent(): Risk | undefined {
    return this.#parent
  }

  @IsEnum(RiskType)
  get type(): RiskType {
    return this.#type
  }

  static create(id: string, details: CreateDetails): Result<Risk> {
    if (!details) {
      return Result.error('Missing details')
    }

    const risk = new Risk(details, id)

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
