import { Result } from '@util/result'

interface Details {
  msg: string
  data?: Record<string, unknown>
}

interface ErrorDetails extends Details {
  error?: Error
}

type ConsoleArgs = [string, ...Array<Error | Pick<Details, 'data'>>]

class Logger {
  private constructor() {
    // empty
  }

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
        msg: result.errorMessage || 'unknown error',
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

  public static new(): Logger {
    return new Logger()
  }
}

export { Logger }
