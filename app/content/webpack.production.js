/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../../config/webpack.common.js')

module.exports = merge(common(path.resolve(__dirname, '../../node_modules') /* rootNodeModules */), {
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/server.ts')],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
})
