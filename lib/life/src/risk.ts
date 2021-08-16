import { IsEnum, isInstance, IsOptional, IsString, MinLength, validateSync } from 'class-validator'
import { Result, resultError, resultOk } from '@util'

enum RiskType {
  Risk = 'Risk',
  Goal = 'Goal',
  Condition = 'Condition',
}

enum Impact {
  High = 'High',
  Normal = 'Normal',
}

enum Likelihood {
  High = 'High',
  Normal = 'Normal',
}

enum Category {
  Health = 'Category',
  Wealth = 'Wealth',
  Security = 'Security',
}

type CreateDetails = Pick<Risk, 'category' | 'impact' | 'likelihood' | 'name' | 'notes' | 'parent' | 'type'>

interface Risk {
  id: string
  category: Category
  impact: Impact
  likelihood: Likelihood

  name: string
  notes?: string
  parent?: Risk
  type: RiskType
}

function newRisk(id: string, details: CreateDetails): Result<Risk> {
  if (!details) {
    return resultError('Missing details')
  }

  // Manual check as @IsInstance(RiskImpl) will result in "Cannot access before initialization" error
  if (typeof details.parent !== 'undefined' && !isInstance(details.parent, RiskImpl)) {
    return resultError('parent must be instance of Risk')
  }

  const risk = new RiskImpl(details, id)

  // Validate at runtime in addition to compile time
  const errors = validateSync(risk)
  if (errors.length > 0) {
    const constraints = errors[0].constraints
    if (!constraints) {
      return resultError('Validation failed')
    }
    return resultError(Object.values(constraints)[0])
  }

  return resultOk(risk)
}

class RiskImpl implements Risk {
  #id: string

  #category: Category
  #impact: Impact
  #likelihood: Likelihood

  #name: string
  #notes?: string
  #parent?: Risk
  #type: RiskType

  constructor({ category, impact, likelihood, name, notes, parent, type }: CreateDetails, id: string) {
    this.#id = id

    this.#category = category
    this.#impact = impact
    this.#likelihood = likelihood
    this.#name = name
    this.#notes = notes
    this.#parent = parent
    this.#type = type
  }

  @MinLength(1)
  @IsString()
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

  @MinLength(2)
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
}

export type { Risk, CreateDetails }
export { newRisk, Category, RiskType, Impact, Likelihood }
