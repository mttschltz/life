module.exports = {
  ignorePatterns: ['dist/**/*', 'src/__generated__/**/*'],
  extends: ['plugin:node/recommended'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-extraneous-require': 'off',
    'node/no-unpublished-require': 'off',
    'node/no-unpublished-import': 'off',
  },
}
