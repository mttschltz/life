import { JsonRepo } from '@life/repo/json'
import type { Json } from '@life/repo/json'
import { Resolvers } from '@life/generated/graphql'
import * as typeDefs from '@life/graph/type-defs.graphql'

// type ListRisksCriteria = UsecaseListRisksCriteria

export class GraphService {
  #jsonRepo: JsonRepo

  constructor(json: Partial<Json>) {
    this.#jsonRepo = new JsonRepo(json)
  }

  resolvers(): Resolvers {
    return {
      Mutation: {
        followUser: async () => {
          this.#jsonRepo.listRisks(undefined) // TODO: Remove, this is just to prevent ts error
          return 1
        },
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeDefs(): any {
    return typeDefs
  }
}

// resolvers

// TODO:
// The ApolloServer needs
// resolvers
// typeDefs (.graphql)
// config
// probably to provide the empty {} for the DB

// So
// Store: Creates new GraphqlService, injecting JsonRepo (empty object: {})
//        ... lib/life/api/graph/index.js
//        ... lib/life/api/graph/resolver<1>.js, etc
// Life: Returns resolvers that use the json repo, and returns typeDefs
//       Are resolvers themselves able to be injected..? with dbConnection or something in context? like this? https://github.com/suzukalight/clean-architecture-nodejs-graphql-codegen/blob/d188e78b238d987f6b62135fb8395ecf905b31d5/src/backend/src/infrastructure/apollo-server/resolvers/query/User/user.ts
