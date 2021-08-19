/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const common = require('../../config/webpack.common.js')

module.exports = (env) => {
  const watch = env.watch?.toLowerCase() === 'true'

  return merge(common(path.resolve(__dirname, '../../node_modules') /* rootNodeModules */), {
    devtool: 'inline-source-map',
    entry: [path.join(__dirname, 'src/server.ts'), ...(watch ? ['webpack/hot/poll?1000'] : [])],
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
    watch,
  })
}
