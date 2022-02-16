import { Identifier } from './identifier'

interface Entity {
  __entity: string
  id: Identifier
}

type EntityValidationShape = Pick<Entity, '__entity'>

type WithValidationShapeEntities<T> = {
  [Property in keyof T]: T[Property] extends EntityValidationShape | undefined
    ? Pick<NonNullable<T[Property]>, '__entity'>
    : T[Property]
}

type WithValidationShapeEntityArrays<T> = {
  [Property in keyof T]: T[Property] extends { __entity: string }[]
    ? Pick<T[Property][number], '__entity'>[]
    : T[Property]
}

type EntitySchema<T> = WithValidationShapeEntities<WithValidationShapeEntityArrays<T>>

export type { EntitySchema }
