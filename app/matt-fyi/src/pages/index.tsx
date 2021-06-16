import * as React from "react";
import { createPlan } from "life/src/usecase/createPlan";

const IndexPage = () => {
  const plan = createPlan("a plan");

  return <main>Plan: {plan.name}</main>;
};

export default IndexPage;
