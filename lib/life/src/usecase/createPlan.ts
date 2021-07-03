import { Plan } from 'life/src/plan'

export const createPlan = (name: string): Plan => {
  return new Plan(name)
}
