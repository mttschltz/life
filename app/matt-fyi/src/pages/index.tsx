import * as React from 'react'
import { createPlan } from '@life/usecase'

const IndexPage = (): JSX.Element => {
  const plan = createPlan('a plan')

  return <main>Plan: {plan.name}</main>
}

export default IndexPage
