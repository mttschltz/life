import type { ListRisksCriteria } from '@life/usecase/listRisks'
import { Category as GraphCategory, QueryRisksArgs, RequireFields, Resolvers } from '@life/generated/graphql'
import * as typeDefs from '@life/service/graph/type-defs.graphql'
import { ServiceFactory } from '@life/service/factory'
import { GraphMapper } from '@life/service/graph/mapper'

export class GraphService {
  #factory: ServiceFactory
  #mapper: GraphMapper

  constructor(factory: ServiceFactory, mapper: GraphMapper) {
    this.#factory = factory
    this.#mapper = mapper
  }

  resolvers(): Resolvers {
    return {
      Mutation: {
        followUser: async () => {
          return 1
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
            // TODO: return error
          }

          const mappingResults = this.#mapper.risks(result.getValue())
          if (mappingResults.hasError()) {
            // TODO: return error
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
}
