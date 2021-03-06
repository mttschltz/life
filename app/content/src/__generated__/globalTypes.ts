/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CategoryTopLevel {
  HEALTH = "HEALTH",
  SECURITY = "SECURITY",
  WEALTH = "WEALTH",
}

/**
 * Create risk input.
 */
export interface CreateRiskInput {
  uriPart: string;
  category: CategoryTopLevel;
  name: string;
  parentId?: string | null;
  notes?: string | null;
  updated: Date;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
