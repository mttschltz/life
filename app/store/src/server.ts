import { ApolloServer } from 'apollo-server'
import { environment } from '@store/environment'
import { GraphService } from '@life/api/graph/service'
import { newMapper } from '@life/api/graph/mapper'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import {
  newCategoryInteractorFactory,
  newRiskInteractorFactory,
  newUpdatedInteractorFactory,
} from '@life/api/interactorFactory'
import { newLogger } from '@helper/logger'
import { transpile } from '@helper/mdx'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { JsonStore } from '@life/repo/json/service'
import { RiskMapper as RiskJsonMapper, newCategoryMapper } from '@life/repo/json/mapper'
import { newCategoryRepoJson } from '@life/repo/json/category'
import { newUpdatedRepoJson } from '@life/repo/json/updated'
import { newRiskRepoJson } from '@life/repo/json/risk'
import jsonfile from 'jsonfile'

const argv = yargs(hideBin(process.argv))
  .options({
    seed: {
      type: 'string',
      default: '',
      describe: 'path to JSON file containing seed data for the database JSON store',
    },
  })
  .parseSync()

const isIsoDate = (str: string): boolean => {
  try {
    return str === new Date(str).toISOString()
  } catch (e) {
    return false
  }
}

type JsonPropValue = bigint | boolean | number | object | string | null | undefined

const isRecord = (val: JsonPropValue): val is Record<string, JsonPropValue> => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/* eslint-disable no-param-reassign */
const convertDates = (obj: Record<string, JsonPropValue>): void => {
  for (const key in obj) {
    const val = obj[key]
    if (typeof val === 'string') {
      obj[key] = isIsoDate(val) ? new Date(val) : val
    } else if (isRecord(val)) {
      convertDates(val)
    }
  }
}
/* eslint-enable no-param-reassign */

let jsonStore: JsonStore = { risk: {}, category: {} }
if (argv.seed) {
  console.info(`Using seed data from path: \'${argv.seed}\'`)
  jsonStore = jsonfile.readFileSync(argv.seed) as JsonStore
  convertDates(jsonStore as unknown as Record<string, JsonPropValue>)
}

const categoryRepo = newCategoryRepoJson(jsonStore, newCategoryMapper())
const riskRepo = newRiskRepoJson(jsonStore, new RiskJsonMapper())
const updatedRepo = newUpdatedRepoJson(categoryRepo, riskRepo)

// Interactors
const graphService = new GraphService(
  {
    category: newCategoryInteractorFactory(categoryRepo),
    risk: newRiskInteractorFactory(riskRepo),
    updated: newUpdatedInteractorFactory(updatedRepo),
  },
  newMapper(transpile),
  newLogger(),
)

// Server
const server = new ApolloServer({
  resolvers: graphService.resolvers(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  typeDefs: graphService.typeDefs(),
  introspection: environment.apollo.introspection,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
})

void server.listen(environment.port).then(({ url }) => {
  console.log(`Server ready at ${url}. `)
})

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    void server.stop()
  })
}
