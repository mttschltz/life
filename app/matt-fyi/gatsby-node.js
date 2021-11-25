'use strict'

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  // Allow webpack to use TSConfig 'paths'
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}

// This pattern from here
// https://gist.github.com/clarkdave/53cc050fa58d9a70418f8a76982dd6c8
// https://gist.github.com/JohnAlbin/2fc05966624dffb20f4b06b4305280f9

require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

// exports.sourceNodes = require('./src/gatsby/sourceNodes').default
exports.createPages = require('./src/gatsby/createPages').default
