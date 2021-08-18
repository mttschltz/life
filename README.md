# Development Environment

## VSCode

- Install https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql

# Decisions

## Dependencies

- Exact versions to comply with https://12factor.net/dependencies
- All devDependencies until needed otherwise: https://github.com/webpack/webpack/issues/520

# TODOs

## Codebase quality

- [ ] **Re-enable `tsconfig.json->isolatedModules`.** Requires graphql types to not be exported globally, which `gatsby-plugin-typegen` does.
- [ ] Move `lib/util/test.ts` to somewhere more relevant to unit testing utilities
- [ ] ESLint rules: No relative imports (tried this but didn't work: https://github.com/import-js/eslint-plugin-import/blob/HEAD/docs/rules/no-relative-packages.md)
- [ ] Less tsconfig duplication

## Developer experience

### General

- [ ] **Intellisense for GraphQL.** See `graphql.config.yml`.

### matt-fyi

- [ ] **Generate types for GraphQL query inside `createPages.ts`.**

- [ ] **Non-optional fields should not be typed as optional.** `gatsby-plugin-typegen` applies Maybe utility type to all fields.
