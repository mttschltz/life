/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRiskInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRiskMutation
// ====================================================

export interface CreateRiskMutation_createRisk {
  __typename: "Risk";
  /**
   * The id.
   */
  id: string;
}

export interface CreateRiskMutation {
  /**
   * Create a risk.
   */
  createRisk: CreateRiskMutation_createRisk;
}

export interface CreateRiskMutationVariables {
  input: CreateRiskInput;
}
