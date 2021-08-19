import { ApolloError, Config } from 'apollo-server'
import type { ListRisksCriteria } from '@life/usecase/listRisks'
import { Category as GraphCategory } from '@life/__generated__/graphql'
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
      Mutation: {
        createRisk: async (_, { input }): Promise<GraphRisk> => {
          // TODO: Instead of mapping each enum, etc individually, map CreateRiskInput
          // to CreateRiskRequest. This should make testing easier.
          const categoryResult = this.#mapper.toCategory(input.category)
          if (!categoryResult.ok) {
            this.#logger.result(categoryResult)
            throw this.resultError(categoryResult)
          }

          const riskResult = await this.#factory.createRiskInteractor().createRisk({
            category: categoryResult.value,
            name: input.name,
            parentId: input.parentId ? input.parentId : undefined,
            impact: Impact.Normal,
            likelihood: Likelihood.Normal,
            type: RiskType.Condition,
            uriPart: input.uriPart,
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
      Risk: {
        parent: async (risk): Promise<GraphRisk | null> => {
          const parentResult = await this.#factory.fetchRiskParentInteractor().fetchRiskParent(risk.id)
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
          const childrenResult = await this.#factory.fetchRiskChildrenInteractor().fetchRiskChildren(risk.id)
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
      Query: {
        risks: async (_, args: RequireFields<QueryRisksArgs, never>): Promise<GraphRisk[]> => {
          const criteria: ListRisksCriteria = {}
          switch (args.category) {
            case GraphCategory.Health:
              criteria.category = 'health'
              break
            case GraphCategory.Wealth:
              criteria.category = 'wealth'
              break
            case GraphCategory.Security:
              criteria.category = 'security'
              break
          }

          const result = await this.#factory.listRisksInteractor().listRisks(criteria)
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

    if (error?.stack) {
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
