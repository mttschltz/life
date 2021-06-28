/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

// const { Service } = require('@life/service')
// import { Service } from 'life/src/service'

const RISK_NODE_TYPE = `Risk`

import type { SourceNodesArgs } from 'gatsby'

// If we want to create our own schemas, we could do this from Typescript classes using annnotations
// with this module: https://typegraphql.com/docs/installation.html

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const sourceNodes = async ({ actions, createContentDigest, createNodeId }: SourceNodesArgs) => {
  const { createNode } = actions

  // TODO:
  //   const service = new Service()
  // 1. Create empty repository: {}
  // 2. Populate it
  // 3. query it

  const data = {
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
