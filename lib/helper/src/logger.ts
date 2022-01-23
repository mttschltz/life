import { Result } from '@helper/result'

interface Details {
  msg: string
  data?: Record<string, unknown>
}

interface ErrorDetails extends Details {
  error?: Error
}

type ConsoleArgs = [string, ...Array<Error | Pick<Details, 'data'>>]

interface Logger {
  info: (details: Details) => void
  warn: (details: Details) => void
  error: (details: Details) => void
  result: <T>(result: Result<T>) => void
}

function newLogger(): Logger {
  return new LoggerImpl()
}

class LoggerImpl implements Logger {
  public info(details: Details): void {
    const args: ConsoleArgs = [details.msg]
    details.data && args.push(details.data)
    console.info(...args)
  }

  public warn(details: Details): void {
    const args: ConsoleArgs = [details.msg]
    details.data && args.push(details.data)
    console.warn(...args)
  }

  public error(details: ErrorDetails): void {
    const args: ConsoleArgs = [details.msg]
    details.error && args.push(details.error)
    details.data && args.push(details.data)
    console.error(...args)
  }

  public result<T>(result: Result<T>): void {
    if (!result.ok) {
      this.error({
        msg: result.message,
        error: result.error,
      })
    } else {
      this.info({
        msg: 'ok result',
        data: {
          value: result.value,
        },
      })
    }
  }
}

export { newLogger }
export type { Logger }
