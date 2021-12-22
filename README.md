# Installation

1. Install dependencies

```
yarn
```

2. Run development server

```
develop:matt-fyi
```

3. Or create production build

```
build:matt-fyi
```

## Development Environment

### Editor

Install VSCode with the following extensions:

- [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

### Environment

Configure Docker to [run as non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user). Required for visual regression tests.

# Development

## Debugging

- Pre-commit: `npx lint-staged -d`
- Github Workflows: Install [act](https://github.com/nektos/act) and execute commands like
  - `act -s SLACK_BOT_TOKEN=<token> -W "./.github/workflows/slack-tests.yml"`

# Decisions

## Dependencies

- Exact versions to comply with https://12factor.net/dependencies
- All devDependencies until needed otherwise: https://github.com/webpack/webpack/issues/520

# TODOs and issues

## Codebase quality

- [ ] **Re-enable `tsconfig.json->isolatedModules`.** Requires graphql types to not be exported globally, which `gatsby-plugin-typegen` does.
- [ ] Move `lib/util/test.ts` to somewhere more relevant to unit testing utilities
- [ ] ESLint rules: No relative imports (tried this but didn't work: https://github.com/import-js/eslint-plugin-import/blob/HEAD/docs/rules/no-relative-packages.md)
- [ ] Less tsconfig duplication

## Developer experience

### General

- [ ] **Intellisense for GraphQL.** only works for one project at a time. Need to toggle between Life and matt.fyi. See `graphql.config.yml`.

### matt-fyi

- [ ] **Generate types for GraphQL query inside `createPages.ts`.**

- [ ] **Non-optional fields should not be typed as optional.** `gatsby-plugin-typegen` applies Maybe utility type to all fields.
