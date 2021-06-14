import {Plan} from '../plan';

export const createPlan = (name: string) => {
  return new Plan(name);
};
