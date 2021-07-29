import { ApolloError } from 'apollo-server'
import type { ListRisksCriteria } from '@life/usecase/listRisks'
import { Category as GraphCategory, QueryRisksArgs, RequireFields, Resolvers } from '@life/generated/graphql'
import * as typeDefs from '@life/service/graph/type-defs.graphql'
import { ServiceFactory } from '@life/service/factory'
import { GraphMapper } from '@life/service/graph/mapper'
import { Logger } from '@util/logger'
import { Result } from '@util/result'
import { Impact, Likelihood, RiskType } from '@life/risk'

export class GraphService {
  #factory: ServiceFactory
  #mapper: GraphMapper
  #logger: Logger

  constructor(factory: ServiceFactory, mapper: GraphMapper, logger: Logger) {
    this.#factory = factory
    this.#mapper = mapper
    this.#logger = logger
  }

  resolvers(): Resolvers {
    return {
      Mutation: {
        createRisk: async (_, { input }) => {
          // TODO: Instead of mapping each enum, etc individually, map CreateRiskInput
          // to CreateRiskRequest. This should make testing easier.
          const categoryResult = this.#mapper.toCategory(input.category)
          if (!categoryResult.isSuccess()) {
            this.#logger.result(categoryResult)
            throw this.resultError(categoryResult)
          }

          const riskResult = this.#factory.createRiskInteractor().createRisk({
            category: categoryResult.getValue(),
            name: input.name,
            parentId: input.parentId ? input.parentId : undefined,
            impact: Impact.Normal,
            likelihood: Likelihood.Normal,
            type: RiskType.Condition,
            uriPart: input.uriPart,
          })
          if (!riskResult.isSuccess()) {
            this.#logger.result(riskResult)
            throw this.resultError(riskResult)
          }

          const mappingResult = this.#mapper.fromRisk(riskResult.getValue())
          if (!mappingResult.isSuccess()) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }
          return mappingResult.getValue()
        },
      },
      Risk: {
        parent: async (risk) => {
          const parentResult = this.#factory.fetchRiskParentInteractor().fetchRiskParent(risk.id)
          if (!parentResult.isSuccess()) {
            this.#logger.result(parentResult)
            throw this.resultError(parentResult)
          }

          const parent = parentResult.getValue()
          if (!parent) {
            return null
          }

          const mappingResult = this.#mapper.fromRisk(parent)
          if (!mappingResult.isSuccess()) {
            this.#logger.result(mappingResult)
            throw this.resultError(mappingResult)
          }

          return mappingResult.getValue()
        },
      },
      Query: {
        risks: async (_, args: RequireFields<QueryRisksArgs, never>) => {
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

          const result = this.#factory.listRisksInteractor().listRisks(criteria)
          if (!result.isSuccess()) {
            this.#logger.result(result)
            throw this.resultError(result)
          }

          const mappingResults = this.#mapper.risks(result.getValue())
          const errorResult = mappingResults.firstErrorResult()
          if (errorResult) {
            this.#logger.result(errorResult)
            throw this.resultError(errorResult)
          }

          return mappingResults.getValues()
        },
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeDefs(): any {
    return typeDefs
  }

  private resultError<T>(result: Result<T>): ApolloError {
    const error = result.getError()

    if (error?.stack) {
      return new ApolloError(result.getErrorMessage(), undefined, {
        exception: {
          stacktrace: error.stack,
        },
      })
    }

    return new ApolloError(result.getErrorMessage())
  }
}
