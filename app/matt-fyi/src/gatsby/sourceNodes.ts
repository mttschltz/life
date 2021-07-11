/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

// const { Service } = require('life/src/service')
// import { Service } from 'life/src/service'

const RISK_NODE_TYPE = `Risk`

import type { SourceNodesArgs } from 'gatsby'
// import { Category, Impact, Likelihood, RiskType } from 'life/src'
// import { Category, Impact, Likelihood, RiskType } from 'life/src'
// import { Service } from 'life/src/service'

// If we want to create our own schemas, we could do this from Typescript classes using annnotations
// with this module: https://typegraphql.com/docs/installation.html

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const sourceNodes = async ({ actions, createContentDigest, createNodeId }: SourceNodesArgs) => {
  const { createNode } = actions

  // TODO:
  // From how wrk does stuff:
  // - the 'app', when started, creates a DB connection (i.e. creates empty, untyped {})
  // - all those connections/dependencies to the outside world are put into a service factory
  //   (can include env keys, etc). the service factory includes interactor factories
  // - interactor factories create repos (and other services necessary for a usecase)
  //   by passing a DB connection (or env vars) to a factory for the repo (or service).
  //   a usecase interfactor is then returned with those dependencies (repos, services) injected
  // - the interactor factory is injected to a service that listens for calls... when
  //   a method on the service is called, it creates a usecase interactor by calling the factory
  //   function (not knowing anything about databases, repos, or other services itself... those are for the
  //   usecase). It then calls the created interactor with stuff relevant from the method call
  //   e.g. params and other context
  // - also: repo interfaces are in the domain. a repo implementation may group them together for
  //   convenience (e.g. in case lots of individual repo interfaces exist but want to be implemented at once)
  //   but it can't define the methods... the usecases and domain need to be able to call them and they can't
  //   know about repo implementations.
  // const service = new Service()
  // service.createRisk({
  //   // const riskResult = service.createRisk({
  //   category: Category.Health,
  //   impact: Impact.High,
  //   likelihood: Likelihood.High,
  //   name: 'A risk',
  //   type: RiskType.Condition,
  //   uriPart: 'a-risk',
  // })
  // TODO: list risks

  const data = {
    // risks: [riskResult.getValue()],
    risks: [
      { uriPart: 'risk-1', name: `risk 1b` },
      { uriPart: 'risk-2', name: `risk 2b` },
    ],
  }

  console.log('Creating source nodes!!!!!!!!!!!!!!!!')

  // loop through data and create Gatsby nodes
  data.risks.forEach((risk) =>
    createNode({
      ...risk,
      id: createNodeId(`${RISK_NODE_TYPE}-${risk.uriPart}`),
      parent: null,
      children: [],
      internal: {
        type: RISK_NODE_TYPE,
        content: JSON.stringify(risk),
        contentDigest: createContentDigest(risk),
      },
    }),
  )

  return
}

export default sourceNodes
