/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Category {
  HEALTH = "HEALTH",
  SECURITY = "SECURITY",
  WEALTH = "WEALTH",
}

/**
 * Create risk input.
 */
export interface CreateRiskInput {
  uriPart: string;
  category: Category;
  name: string;
  parentId?: string | null;
  notes?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
