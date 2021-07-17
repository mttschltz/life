import { Resolvers } from '@life/generated/graphql'

export const resolvers: Resolvers = {
  Mutation: {
    followUser: async () => {
      return 1
    },
  },
}
