// Treat errors and warnings the same: There should be none.
//
// If there is a justified reason for breaking a rule, add a single-line exception.
// Only add a file-evel exception if the file's context is what justifies breaking the rule.
module.exports = {
  root: true,
  // -----
  // Javascript config
  // -----
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'prettier', // Disable other rules that may conflict with Prettier; via 'eslint-config-prettier'
    'plugin:prettier/recommended', // Adds ESLint warnings/errors for Prettier warnings/errors.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'import/group-exports': 'error',
    'import/exports-last': 'error',
    'import/no-default-export': 'error',
    'no-param-reassign': ['error', { props: true }],
  },

  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  plugins: ['import'],

  overrides: [
    // -----
    // Typescript config
    // -----
    {
      files: ['*.ts', '*.tsx'],

      parser: '@typescript-eslint/parser', // Specifies the ESLint parser
      parserOptions: {
        // These two properties enable type aware linting rules for @typescript-eslint
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
          jsx: true, // Allows for the parsing of JSX
        },
      },

      extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/eslint-recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier', // Disable other rules that may conflict with Prettier; via 'eslint-config-prettier'
        'plugin:prettier/recommended', // Adds ESLint warnings/errors for Prettier warnings/errors.
        'plugin:import/typescript', // this line does the trick
      ],
      rules: {
        'import/group-exports': 'error',
        'import/exports-last': 'error',
        'import/no-default-export': 'error',
        'no-param-reassign': ['error', { props: true }],
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/member-ordering': [
          'error',
          {
            interfaces: ['signature', 'field', 'constructor', 'method'],
            typeLiterals: ['signature', 'field', 'constructor', 'method'],
            classes: ['field', 'constructor', 'method'],
          },
        ],
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/no-dynamic-delete': ['error'],
        '@typescript-eslint/no-implicit-any-catch': ['error'],
        '@typescript-eslint/no-require-imports': ['error'],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['error'],
        '@typescript-eslint/no-unnecessary-condition': ['error'],
        '@typescript-eslint/no-unnecessary-qualifier': ['error'],
        '@typescript-eslint/no-unnecessary-type-arguments': ['error'],
        '@typescript-eslint/no-unnecessary-type-constraint': ['error'],
        '@typescript-eslint/no-unsafe-argument': ['error'],
        '@typescript-eslint/non-nullable-type-assertion-style': ['error'],
        '@typescript-eslint/prefer-enum-initializers': ['error'],
        '@typescript-eslint/prefer-for-of': ['error'],
        '@typescript-eslint/prefer-function-type': ['error'],
        '@typescript-eslint/prefer-includes': ['error'],
        '@typescript-eslint/prefer-literal-enum-member': ['error'],
        '@typescript-eslint/prefer-nullish-coalescing': ['error'],
        '@typescript-eslint/prefer-optional-chain': ['error'],
        '@typescript-eslint/prefer-readonly': ['error'],
        // '@typescript-eslint/prefer-return-this-type': ['error'], // Not yet merged in plugin... could enable once it is
        '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
        '@typescript-eslint/prefer-ts-expect-error': ['error'],
        '@typescript-eslint/promise-function-async': ['error'],
        '@typescript-eslint/require-array-sort-compare': ['error'],
        '@typescript-eslint/sort-type-union-intersection-members': ['error'],
        '@typescript-eslint/unified-signatures': ['error'],
        'dot-notation': ['off'],
        '@typescript-eslint/dot-notation': ['error'],
        'no-duplicate-imports': ['off'],
        '@typescript-eslint/no-duplicate-imports': ['error'],
        'no-invalid-this': ['off'],
        '@typescript-eslint/no-invalid-this': ['error'],
        'no-loop-func': ['off'],
        '@typescript-eslint/no-loop-func': ['error'],
        'no-loss-of-precision': ['off'],
        '@typescript-eslint/no-loss-of-precision': ['error'],
        'no-redeclare': ['off'],
        '@typescript-eslint/no-redeclare': ['error'],
        'no-shadow': ['off'],
        '@typescript-eslint/no-shadow': ['error'],
        'no-throw-literal': ['off'],
        '@typescript-eslint/no-throw-literal': ['error'],
        'no-useless-constructor': ['off'],
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variableLike',
            format: ['strictCamelCase'],
            filter: {
              regex: '^_+$',
              match: false,
            },
          },
          {
            selector: 'variable',
            format: ['strictCamelCase', 'StrictPascalCase'], // StrictPascalCase for JSX component names
            modifiers: ['const'],
            types: ['function'],
          },
          {
            selector: 'variable',
            format: ['strictCamelCase', 'UPPER_CASE'],
            modifiers: ['const'],
          },
          {
            selector: 'memberLike',
            format: ['strictCamelCase'],
          },
          {
            selector: 'enumMember',
            format: ['StrictPascalCase'],
          },
          {
            selector: 'typeLike',
            format: ['StrictPascalCase'],
          },
          {
            selector: 'property',
            format: ['strictCamelCase'],
          },
          {
            selector: 'method',
            format: ['strictCamelCase'],
          },
        ],
      },
    },
  ],
}
