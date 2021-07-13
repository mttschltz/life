import { DateTimeResolver } from 'graphql-scalars'
import { Resolvers } from '@store/generated/graphql'

export const resolvers: Resolvers = {
  Mutation: {
    followUser: async () => {
      return 9999
    },
  },
  DateTime: DateTimeResolver,
}
