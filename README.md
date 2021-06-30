# TODOs

## Codebase quality

- [ ] **Re-enable `tsconfig.json->isolatedModules`.** Requires graphql types to not be exported globally, which `gatsby-plugin-typegen` does.

- [ ] **Don't commit generated types.** Requires a new way to deploy that still checks types across entire codebase but can start up a gatsby server so `gatsby-plugin-typegen` can generate types.

- [ ] **`yarn test-repo` in `app/matt-fyi` shouldn't reach back to root.** Requires deploy process to be able to run from root of repo.

## Developer experience

- [ ] Intellisense for GraphQL.

- [ ] Generate types for GraphQL query inside `createPages.ts`.
