module.exports = {
  'app/matt-fyi/**/*.{ts,tsx}': [
    () => {
      // Don't forward the staged file(s) or tsc will ignore tsconfig.json
      return 'yarn lint'
    },
  ],
  '*.ts': ['yarn test'],
}
