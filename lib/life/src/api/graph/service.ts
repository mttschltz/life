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

          return this.#mapper.categoryFromUsecase(parent)
        },
        children: async (category): Promise<Category[]> => {
          const childrenResults = await this.#factory.category.fetchChildrenInteractor().fetchChildren(category.id)
          if (childrenResults.firstErrorResult) {
            this.#logger.result(childrenResults.firstErrorResult)
            throw this.resultError(childrenResults.firstErrorResult)
          }

          return this.#mapper.categoriesFromUsecase(childrenResults.okValues)
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Updated: {
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-function-return-type
        __resolveType: (obj) => {
          if (this.#mapper.isUpdatedCategory(obj)) {
            return 'Category'
          }
          if (this.#mapper.isUpdatedRisk(obj)) {
            return 'Risk'
          }
          return null
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Mutation: {
        // ignore code coverage for risks until they are refactored
        createRisk: /* istanbul ignore next */ async (_, { input }): Promise<Risk> => {
          // TODO: Instead of mapping each enum, etc individually, map CreateRiskInput
          // to CreateRiskRequest. This should make testing easier.
          const categoryResult = this.#mapper.categoryTopLevelToUsecase(input.category)
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
            // TODO: Remove hardcoding
            shortDescription: 'short description',
            updated: new Date(),
          })
          if (!riskResult.ok) {
            this.#logger.result(riskResult)
            throw this.resultError(riskResult)
          }

          const mappingResult = this.#mapper.riskFromUsecase(riskResult.value)
          if (!mappingResult.ok) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }
          return mappingResult.value
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Risk: {
        // ignore code coverage for risks until they are refactored
        parent: /* istanbul ignore next */ async (risk): Promise<Risk | null> => {
          const parentResult = await this.#factory.risk.fetchRiskParentInteractor().fetchRiskParent(risk.id)
          if (!parentResult.ok) {
            this.#logger.result(parentResult)
            throw this.resultError(parentResult)
          }

          const parent = parentResult.value
          if (!parent) {
            return null
          }

          const mappingResult = this.#mapper.riskFromUsecase(parent)
          if (!mappingResult.ok) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }

          return mappingResult.value
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

          return this.#mapper.categoriesFromUsecase(categoryResults.okValues)
        },
        // ignore code coverage for risks until they are refactored
        risks: /* istanbul ignore next */ async (_, args: RequireFields<QueryRisksArgs, never>): Promise<Risk[]> => {
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

          const mappingResults = this.#mapper.risksFromUsecase(riskResults.okValues)
          const errorResult = mappingResults.firstErrorResult
          if (errorResult) {
            this.#logger.result(errorResult)
            throw this.resultError(errorResult)
          }

          return mappingResults.okValues
        },
        updated: async (): Promise<(Category | Risk)[]> => {
          const updatedResults = await this.#factory.updated.listInteractor().list({ count: 10 })
          if (updatedResults.firstErrorResult) {
            this.#logger.result(updatedResults.firstErrorResult)
            throw this.resultError(updatedResults.firstErrorResult)
          }

          const mappedResults = this.#mapper.updatedFromUsecase(updatedResults.okValues)
          const errorResult = mappedResults.firstErrorResult
          if (errorResult) {
            this.#logger.result(errorResult)
            throw this.resultError(errorResult)
          }

          return mappedResults.okValues
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
      return new ApolloError(result.message, undefined, {
        exception: {
          stacktrace: error.stack,
        },
      })
    }

    return new ApolloError(result.message)
  }
}

export { GraphService }
export type { InteractorFactory }
