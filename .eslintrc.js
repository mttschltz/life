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
    'import/group-exports': 2,
    'import/exports-last': 2,
    'import/no-default-export': 2,
    'no-param-reassign': [2, { props: true }],
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
        'import/group-exports': 2,
        'import/exports-last': 2,
        'import/no-default-export': 2,
        'no-param-reassign': [2, { props: true }],
        '@typescript-eslint/explicit-member-accessibility': 2,
        '@typescript-eslint/explicit-function-return-type': 2,
        '@typescript-eslint/member-ordering': [
          2,
          {
            interfaces: ['signature', 'field', 'constructor', 'method'],
            typeLiterals: ['signature', 'field', 'constructor', 'method'],
            classes: ['field', 'constructor', 'method'],
          },
        ],
        '@typescript-eslint/method-signature-style': [2, 'property'],
        '@typescript-eslint/no-dynamic-delete': [2],
        '@typescript-eslint/no-implicit-any-catch': [2],
        '@typescript-eslint/no-require-imports': [2],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': [2],
        '@typescript-eslint/no-unnecessary-condition': [2],
        '@typescript-eslint/no-unnecessary-qualifier': [2],
        '@typescript-eslint/no-unnecessary-type-arguments': [2],
        '@typescript-eslint/no-unnecessary-type-constraint': [2],
        '@typescript-eslint/no-unsafe-argument': [2],
        '@typescript-eslint/non-nullable-type-assertion-style': [2],
        '@typescript-eslint/prefer-enum-initializers': [2],
        '@typescript-eslint/prefer-for-of': [2],
        '@typescript-eslint/prefer-function-type': [2],
        '@typescript-eslint/prefer-includes': [2],
        '@typescript-eslint/prefer-literal-enum-member': [2],
        '@typescript-eslint/prefer-nullish-coalescing': [2],
        '@typescript-eslint/prefer-optional-chain': [2],
        '@typescript-eslint/prefer-readonly': [2],
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
