'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  // Allow webpack to use TSConfig 'paths'
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}

require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

exports.sourceNodes = require('./src/gatsby/sourceNodes').default
exports.createPages = require('./src/gatsby/createPages').default
