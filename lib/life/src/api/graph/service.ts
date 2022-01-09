import { ApolloError, Config } from 'apollo-server'
import type { ListCriteria } from '@life/usecase/risk/list'
import { CategoryTopLevel, Category } from '@life/__generated__/graphql'
import type { QueryRisksArgs, RequireFields, Resolvers, Risk } from '@life/__generated__/graphql'
import * as typeDefs from '@life/api/graph/schema.graphql'
import { InteractorFactory } from '@life/api/interactorFactory'
import { GraphMapper } from '@life/api/graph/mapper'
import { Logger } from '@util/logger'
import { ResultError } from '@util/result'

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
        createRisk: async (_, { input }): Promise<Risk> => {
          // TODO: Instead of mapping each enum, etc individually, map CreateRiskInput
          // to CreateRiskRequest. This should make testing easier.
          const categoryResult = this.#mapper.toCategoryTopLevel(input.category)
          if (!categoryResult.ok) {
            this.#logger.result(categoryResult)
            throw this.resultError(categoryResult)
          }

          // TODO: Remove hardcoding
          const riskResult = await this.#factory.risk.createRiskInteractor().createRisk({
            category: categoryResult.value,
            name: input.name,
            parentId: input.parentId ?? undefined,
            impact: 'High',
            likelihood: 'Normal',
            type: 'Condition',
            uriPart: input.uriPart,
            notes: input.notes ?? undefined,
            shortDescription: 'short description',
            updated: new Date(),
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
        parent: async (risk): Promise<Risk | null> => {
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
        children: async (risk): Promise<Risk[]> => {
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
          const categoryResults = await this.#factory.category.listInteractor().list()
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
        risks: async (_, args: RequireFields<QueryRisksArgs, never>): Promise<Risk[]> => {
          const criteria: ListCriteria = {}
          switch (args.category) {
            case CategoryTopLevel.Health:
              criteria.category = 'health'
              break
            case CategoryTopLevel.Wealth:
              criteria.category = 'wealth'
              break
            case CategoryTopLevel.Security:
              criteria.category = 'security'
              break
          }

          const riskResults = await this.#factory.risk.listInteractor().list(criteria)
          if (riskResults.firstErrorResult) {
            this.#logger.result(riskResults.firstErrorResult)
            throw this.resultError(riskResults.firstErrorResult)
          }

          const mappingResults = this.#mapper.risks(riskResults.okValues)
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
