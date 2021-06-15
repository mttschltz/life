# Systemizing Life - Matt Schultz

## Local development

- Use Node and Yarn versions in `netlify.toml`

## Deployment to Netlify

- Set `NETLIFY_USE_YARN` to `true`, otherwise Netlify will see no yarn.lock in this subdir and default to NPM.
