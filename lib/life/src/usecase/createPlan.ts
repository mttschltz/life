import { Plan } from '@life/plan'

export const createPlan = (name: string): Plan => {
  return new Plan(name)
}
