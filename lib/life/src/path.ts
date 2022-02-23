import { z } from 'zod'

type Path = `/${string}`

interface Routable {
  path: Path
  previousPaths: Path[]
}

const PATH_SCHEMA = z.custom<Path>((val) => /^\/.+/.test(val as string), { message: 'Path does not match regexp' })

export { PATH_SCHEMA }
export type { Path, Routable }
