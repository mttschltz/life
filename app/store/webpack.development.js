/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  entry: ['webpack/hot/poll?1000', path.join(__dirname, 'src/main.ts')],
  externals: [
    'bufferutil',
    'utf-8-validate',
    nodeExternals({
      allowlist: ['webpack/hot/poll?1000'],
      // prevent graphql dependency issue
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    }),
  ],
  mode: 'development',
  plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
  watch: true,
  module: {
    rules: [
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
})

// {
//   test: /\.m?js/,
//   resolve: {
//       fullySpecified: false
//   }
// },
