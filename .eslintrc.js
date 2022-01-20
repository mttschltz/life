// Treat errors and warnings the same: The codebase should have 0 of both to prevent normalizing error states.
//
// - If there is a justified reason for breaking a rule, add a single-line exception.
// - Only add a file-level exception if the file's context justifies breaking the rule.
// - If a rule hurts more than it helps, or we constantly add exceptions to it, we can consider removing it.
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
  ignorePatterns: ['coverage/**/*'],

  extends: [
    'plugin:react/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    'import/group-exports': 'error',
    'import/exports-last': 'error',
    'import/no-default-export': 'error',
    'import/no-relative-parent-imports': 'error',
    'no-param-reassign': ['error', { props: true }],
    'react/prop-types': 'off',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['import'],

  overrides: [
    // -----
    // Typescript config
    // -----
    {
      files: ['*.ts', '*.tsx'],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        // `tsconfigRootDir` and `project` enable type aware linting rules for @typescript-eslint
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },

      extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:eslint-comments/recommended',
      ],
      rules: {
        'import/group-exports': 'error',
        'import/exports-last': 'error',
        'import/no-default-export': 'error',
        'import/no-relative-parent-imports': 'error',
        'no-param-reassign': ['error', { props: true }],
        'react/prop-types': 'off',
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
            filter: {
              regex: '^__typename$',
              match: false,
            },
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
            filter: {
              regex: '^__typename$',
              match: false,
            },
          },
          {
            selector: 'method',
            format: ['strictCamelCase'],
          },
        ],
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': 'off',
      },
    },
  ],
}
