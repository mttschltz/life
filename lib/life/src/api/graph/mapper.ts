import type { Risk as UsecaseRisk } from '@life/usecase/mapper'
import { Category as GraphCategory, Risk as GraphRisk } from '@life/__generated__/graphql'
import { Category } from '@life/risk'
import { Result, resultError, resultOk, results, Results } from '@util/result'
import mdx from '@mdx-js/mdx'
import { transformSync } from '@babel/core'
import BabelPluginPluckImports from 'babel-plugin-pluck-imports'
import objRestSpread from '@babel/plugin-proposal-object-rest-spread'
import htmlAttrToJSXAttr from 'babel-plugin-html-attributes-to-jsx'
import removeExportKeywords from 'babel-plugin-remove-export-keywords'

class GraphMapper {
  public toCategory(graphCategory: GraphCategory): Result<Category> {
    switch (graphCategory) {
      case GraphCategory.Health:
        return resultOk(Category.Health)
      case GraphCategory.Wealth:
        return resultOk(Category.Wealth)
      case GraphCategory.Security:
        return resultOk(Category.Security)
      default:
        return resultError('Unhandled category type')
    }
  }

  public fromCategory(category: Category): Result<GraphCategory> {
    switch (category) {
      case Category.Health:
        return resultOk(GraphCategory.Health)
      case Category.Wealth:
        return resultOk(GraphCategory.Wealth)
      case Category.Security:
        return resultOk(GraphCategory.Security)
      default:
        return resultError('Unhandled category type')
    }
  }

  public fromRisk({ id, category, name, notes }: UsecaseRisk): Result<GraphRisk> {
    const graphCategoryResult = this.fromCategory(category)
    if (!graphCategoryResult.ok) {
      return graphCategoryResult
    }

    // Compile + transpile code from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-mdx/utils/gen-mdx.js
    let notesTranspiled
    if (notes) {
      const code = mdx.sync(notes, {
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const identifiers = Array.from(instance.state.identifiers)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const imports = Array.from(instance.state.imports)
      if (!identifiers.includes(`React`)) {
        identifiers.push(`React`)
        imports.push(`import * as React from 'react'`)
      }

      // results.scopeImports = imports
      // results.scopeIdentifiers = identifiers
      // TODO: be more sophisticated about these replacements
      notesTranspiled = result?.code
        ?.replace(/export\s*default\s*function\s*MDXContent\s*/, `return function MDXContent`)
        .replace(/export\s*{\s*MDXContent\s+as\s+default\s*};?/, `return MDXContent;`)
    }

    return resultOk({
      category: graphCategoryResult.value,
      id,
      name,
      notes: notesTranspiled,
    })
  }

  public risks(risks: UsecaseRisk[]): Results<GraphRisk> {
    return results(risks.map((risk) => this.fromRisk(risk)))
  }
}

export { GraphMapper }
