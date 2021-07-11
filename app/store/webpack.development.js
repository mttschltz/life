/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const common = require('./webpack.common.js')

module.exports = (env) => {
  const watch = env.watch?.toLowerCase() === 'true'

  return merge(common, {
    devtool: 'inline-source-map',
    entry: [path.join(__dirname, 'src/main.ts'), ...(watch ? ['webpack/hot/poll?1000'] : [])],
    mode: 'development',
    plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
    watch,
  })
}
