const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../lib/component/**/*.stories.mdx', '../lib/component/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    // From: https://github.com/storybookjs/storybook/issues/3291#issuecomment-686760728
    // ---
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need

    // Allows importing sass or scss files
    config.module.rules.push({
      test: /\.scss|.sass$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    })

    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ]

    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    // https://www.gatsbyjs.com/docs/how-to/testing/visual-testing-with-storybook/#manual-configuration
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
    // Use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(require.resolve('babel-plugin-remove-graphql-queries'))

    // Return the altered config
    return config
  },
}
