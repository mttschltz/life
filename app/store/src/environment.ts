const defaultPort = 4000

interface Environment {
  apollo: {
    introspection: boolean
    playground: boolean
  }
  port: number | string
}

// TODO: Use this module for env vars... set local defaults in here... if ever need secrets, use 'dotenv' commit .env.template and add .env to gitignore
export const environment: Environment = {
  apollo: {
    introspection: true,
    playground: true,
  },
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort,
}
