import { ApolloError } from 'apollo-server'
import type { ListRisksCriteria } from '@life/usecase/listRisks'
import { Category as GraphCategory, QueryRisksArgs, RequireFields, Resolvers } from '@life/generated/graphql'
import * as typeDefs from '@life/service/graph/type-defs.graphql'
import { ServiceFactory } from '@life/service/factory'
import { GraphMapper } from '@life/service/graph/mapper'
import { Logger } from '@util/logger'
import { Result } from '@util/result'

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
        followUser: async () => {
          return 1
        },
      },
      Risk: {
        parent: async (risk) => {
          // TODO: Test retrieving parent
          // https://www.apollographql.com/docs/apollo-server/data/resolvers/
          const parentResult = this.#factory.fetchRiskParentInteractor().fetchRiskParent(risk.id)
          if (!parentResult.isSuccess) {
            this.#logger.result(parentResult)
            throw this.resultError(parentResult)
          }

          const parent = parentResult.getValue()
          if (!parent) {
            return null
          }

          const mappingResult = this.#mapper.risk(parent)
          if (!mappingResult.isSuccess) {
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
          if (!result.isSuccess) {
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
