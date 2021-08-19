/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = {
  'app/matt-fyi/**/*.{ts,tsx}': [
    () => {
      // Don't forward the staged file(s) or tsc will ignore tsconfig.json
      return 'yarn lint'
    },
  ],
  '**/*.{ts,tsx}': [
    () => {
      // Don't forward the staged file(s) because we want to run the related
      // test files, not necessarily source files.
      // In the future, we could use the matched filenames in this function
      // argument to pass the relevants test files. This might miss some
      // other test files that depend on the source files, though this should
      // get picked up by CI later and, if we have well written code, shouldn't
      // happen much.
      // Or, use this jest argument: jest --findRelatedTests path/to/fileA.js path/to/fileB.js
      return 'yarn test'
    },
  ],
}
