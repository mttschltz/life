declare module '@mdx-js/mdx' {
  export function sync(
    mdx: string,
    options: {
      skipExport: boolean
    },
  ): string
}

declare module 'babel-plugin-pluck-imports'

declare module '@babel/plugin-proposal-object-rest-spread'

declare module 'babel-plugin-html-attributes-to-jsx'

declare module 'babel-plugin-remove-export-keywords'
