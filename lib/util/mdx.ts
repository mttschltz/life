import { sync as mdxSync } from '@mdx-js/mdx'
import { transformSync } from '@babel/core'
import BabelPluginPluckImports from 'babel-plugin-pluck-imports'
import objRestSpread from '@babel/plugin-proposal-object-rest-spread'
import htmlAttrToJSXAttr from 'babel-plugin-html-attributes-to-jsx'
import removeExportKeywords from 'babel-plugin-remove-export-keywords'

const transpile = (mdx?: string): string | undefined => {
  if (!mdx) {
    return undefined
  }
  // Compile + transpile code from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-mdx/utils/gen-mdx.js
  const code = mdxSync(mdx, {
    // filepath: node.fileAbsolutePath,
    // ...options,
    // remarkPlugins: options.remarkPlugins.concat(gatsbyRemarkPluginsAsremarkPlugins),
    skipExport: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const instance = new BabelPluginPluckImports()
  const result = transformSync(code, {
    configFile: false,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    plugins: [instance.plugin, objRestSpread, htmlAttrToJSXAttr, removeExportKeywords],
    presets: [
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require(`@babel/preset-react`),
      [
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(`@babel/preset-env`),
        {
          useBuiltIns: `entry`,
          corejs: 3,
          modules: false,
        },
      ],
    ],
  })

  // not sure how to test these branches
  /* c8 ignore start */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const identifiers = Array.from(instance.state.identifiers)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const imports = Array.from(instance.state.imports)
  if (!identifiers.includes(`React`)) {
    identifiers.push(`React`)
    imports.push(`import * as React from 'react'`)
  }

  return result?.code
    ?.replace(/export\s*default\s*function\s*MDXContent\s*/, `return function MDXContent`)
    .replace(/export\s*{\s*MDXContent\s+as\s+default\s*};?/, `return MDXContent;`)
  /* c8 ignore stop */
}

export { transpile }
