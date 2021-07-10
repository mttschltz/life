# Decisions

## Dependencies

- Exact versions to comply with https://12factor.net/dependencies
- All devDependencies until needed otherwise: https://github.com/webpack/webpack/issues/520

# TODOs

## Codebase quality

- [ ] **Re-enable `tsconfig.json->isolatedModules`.** Requires graphql types to not be exported globally, which `gatsby-plugin-typegen` does.

- [ ] **`yarn test-repo` in `app/matt-fyi` shouldn't reach back to root.** Requires deploy process to be able to run from root of repo.

## Developer experience

- [ ] **Intellisense for GraphQL.** Probably requires `gatsby-plugin-typegen` to have fixed this bug that prevents generation of documents: https://github.com/cometkim/gatsby-plugin-typegen/issues/113

- [ ] **Generate types for GraphQL query inside `createPages.ts`.**
