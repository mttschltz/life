/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = (rootNodeModules) => ({
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.m?js/,
        // layer: 'layer',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  target: 'node',
  externals: [
    'bufferutil',
    'utf-8-validate',
    nodeExternals({
      allowlist: ['webpack/hot/poll?1000'],
      // prevent graphql dependency issue
      modulesDir: rootNodeModules,
    }),
  ],
})
