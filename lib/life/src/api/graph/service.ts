import { ApolloError, Config } from 'apollo-server'
import type { ListRisksCriteria } from '@life/usecase/listRisks'
import { CategoryTopLevel as GraphCategoryTopLevel, Category } from '@life/__generated__/graphql'
import type { QueryRisksArgs, RequireFields, Resolvers, Risk as GraphRisk } from '@life/__generated__/graphql'
import * as typeDefs from '@life/api/graph/schema.graphql'
import { InteractorFactory } from '@life/api/interactorFactory'
import { GraphMapper } from '@life/api/graph/mapper'
import { Logger } from '@util/logger'
import { ResultError } from '@util/result'
import { Impact, Likelihood, RiskType } from '@life/risk'

class GraphService {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #factory: InteractorFactory
  #mapper: GraphMapper
  #logger: Logger
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(factory: InteractorFactory, mapper: GraphMapper, logger: Logger) {
    this.#factory = factory
    this.#mapper = mapper
    this.#logger = logger
  }

  // We may want to use Apollo dataSources at some point to leverage caching, deduplication and error handling.
  // They would probably need to call the usecases, rather than JsonRepo, as they have the relevant logic.
  // But for now, the benefits don't justify the overhead of adding another layer between resolvers and usecases.
  public resolvers(): Resolvers {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Category: {
        parent: async (category): Promise<Category | null> => {
          const parentResult = await this.#factory.category.fetchParentInteractor().fetchParent(category.id)
          if (!parentResult.ok) {
            this.#logger.result(parentResult)
            throw this.resultError(parentResult)
          }

          const parent = parentResult.value
          if (!parent) {
            return null
          }

          const mappingResult = this.#mapper.categoryFromUsecase(parent)
          if (!mappingResult.ok) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }

          return mappingResult.value
        },
        children: async (category): Promise<Category[]> => {
          const childrenResults = await this.#factory.category.fetchChildrenInteractor().fetchChildren(category.id)
          if (childrenResults.firstErrorResult) {
            this.#logger.result(childrenResults.firstErrorResult)
            throw this.resultError(childrenResults.firstErrorResult)
          }

          const mappingResults = this.#mapper.categoriesFromUsecase(childrenResults.okValues)
          if (mappingResults.firstErrorResult) {
            this.#logger.result(mappingResults.firstErrorResult)
            throw this.resultError(mappingResults.firstErrorResult)
          }

          return mappingResults.okValues
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Mutation: {
        createRisk: async (_, { input }): Promise<GraphRisk> => {
          // TODO: Instead of mapping each enum, etc individually, map CreateRiskInput
          // to CreateRiskRequest. This should make testing easier.
          const categoryResult = this.#mapper.toCategoryTopLevel(input.category)
          if (!categoryResult.ok) {
            this.#logger.result(categoryResult)
            throw this.resultError(categoryResult)
          }

          const riskResult = await this.#factory.risk.createRiskInteractor().createRisk({
            category: categoryResult.value,
            name: input.name,
            parentId: input.parentId ?? undefined,
            impact: Impact.Normal,
            likelihood: Likelihood.Normal,
            type: RiskType.Condition,
            uriPart: input.uriPart,
            notes: input.notes ?? undefined,
          })
          if (!riskResult.ok) {
            this.#logger.result(riskResult)
            throw this.resultError(riskResult)
          }

          const mappingResult = this.#mapper.fromRisk(riskResult.value)
          if (!mappingResult.ok) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }
          return mappingResult.value
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Risk: {
        parent: async (risk): Promise<GraphRisk | null> => {
          const parentResult = await this.#factory.risk.fetchRiskParentInteractor().fetchRiskParent(risk.id)
          if (!parentResult.ok) {
            this.#logger.result(parentResult)
            throw this.resultError(parentResult)
          }

          const parent = parentResult.value
          if (!parent) {
            return null
          }

          const mappingResult = this.#mapper.fromRisk(parent)
          if (!mappingResult.ok) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }

          return mappingResult.value
        },
        children: async (risk): Promise<GraphRisk[]> => {
          const childrenResult = await this.#factory.risk.fetchRiskChildrenInteractor().fetchRiskChildren(risk.id)
          if (!childrenResult.ok) {
            this.#logger.result(childrenResult)
            throw this.resultError(childrenResult)
          }

          const mappingResults = this.#mapper.risks(childrenResult.value)
          const errorResult = mappingResults.firstErrorResult
          if (errorResult) {
            this.#logger.result(errorResult)
            throw this.resultError(errorResult)
          }

          return mappingResults.okValues
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Query: {
        categories: async (): Promise<Category[]> => {
          const categoryResults = await this.#factory.category.listCategoriesInteractor().listCategories()
          if (categoryResults.firstErrorResult) {
            this.#logger.result(categoryResults.firstErrorResult)
            throw this.resultError(categoryResults.firstErrorResult)
          }

          const categories = this.#mapper.categoriesFromUsecase(categoryResults.okValues)
          if (categories.firstErrorResult) {
            this.#logger.result(categories.firstErrorResult)
            throw this.resultError(categories.firstErrorResult)
          }

          return categories.okValues
        },
        risks: async (_, args: RequireFields<QueryRisksArgs, never>): Promise<GraphRisk[]> => {
          const criteria: ListRisksCriteria = {}
          switch (args.category) {
            case GraphCategoryTopLevel.Health:
              criteria.category = 'health'
              break
            case GraphCategoryTopLevel.Wealth:
              criteria.category = 'wealth'
              break
            case GraphCategoryTopLevel.Security:
              criteria.category = 'security'
              break
          }

          const result = await this.#factory.risk.listRisksInteractor().listRisks(criteria)
          if (!result.ok) {
            this.#logger.result(result)
            throw this.resultError(result)
          }

          const mappingResults = this.#mapper.risks(result.value)
          const errorResult = mappingResults.firstErrorResult
          if (errorResult) {
            this.#logger.result(errorResult)
            throw this.resultError(errorResult)
          }

          return mappingResults.okValues
        },
      },
    }
  }

  public typeDefs(): Config['typeDefs'] {
    return typeDefs
  }

  private resultError(result: ResultError): ApolloError {
    const error = result.error

    if (error.stack) {
      return new ApolloError(result.message || 'Unknown error', undefined, {
        exception: {
          stacktrace: error.stack,
        },
      })
    }

    return new ApolloError(result.message || 'Unknown error')
  }
}

export { GraphService }
export type { InteractorFactory }
