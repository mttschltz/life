import { IsDate, IsEnum, isInstance, IsOptional, IsString, MinLength, validateSync } from 'class-validator'
import { Result, resultError, resultOk } from '@util/result'
import { Updatable } from './updated'

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

enum CategoryTopLevel {
  Health = 'Category',
  Wealth = 'Wealth',
  Security = 'Security',
}

type CreateDetails = Pick<
  Risk,
  'category' | 'impact' | 'likelihood' | 'name' | 'notes' | 'parent' | 'shortDescription' | 'type' | 'updated'
>

interface Risk extends Updatable {
  id: string
  category: CategoryTopLevel
  impact: Impact
  likelihood: Likelihood

  name: string
  notes?: string
  parent?: Risk
  type: RiskType
}

function newRisk(id: string, details: CreateDetails): Result<Risk> {
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
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #id: string

  #category: CategoryTopLevel
  #impact: Impact
  #likelihood: Likelihood

  #name: string
  #shortDescription: string
  #notes?: string
  #parent?: Risk
  #type: RiskType

  #updated: Date
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(
    { category, impact, likelihood, name, notes, parent, shortDescription, type, updated }: CreateDetails,
    id: string,
  ) {
    this.#id = id

    this.#category = category
    this.#impact = impact
    this.#likelihood = likelihood
    this.#name = name
    this.#notes = notes
    this.#parent = parent
    this.#shortDescription = shortDescription
    this.#type = type
    this.#updated = updated
  }

  @MinLength(1)
  @IsString()
  public get id(): string {
    return this.#id
  }

  // Details

  @IsEnum(CategoryTopLevel)
  public get category(): CategoryTopLevel {
    return this.#category
  }

  @IsEnum(Impact)
  public get impact(): Impact {
    return this.#impact
  }

  @IsEnum(Likelihood)
  public get likelihood(): Likelihood {
    return this.#likelihood
  }

  @MinLength(2)
  @IsString()
  public get name(): string {
    return this.#name
  }

  @MinLength(2)
  @IsString()
  public get shortDescription(): string {
    return this.#shortDescription
  }

  @IsOptional()
  @IsString()
  public get notes(): string | undefined {
    return this.#notes
  }

  @IsOptional()
  public get parent(): Risk | undefined {
    return this.#parent
  }

  @IsEnum(RiskType)
  public get type(): RiskType {
    return this.#type
  }

  @IsDate()
  public get updated(): Date {
    return this.#updated
  }
}

export type { Risk, CreateDetails }
export { newRisk, CategoryTopLevel, RiskType, Impact, Likelihood }
