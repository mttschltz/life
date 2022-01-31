const filterNonNullish = <T>(obj: T | undefined): obj is T => {
  return obj !== null && typeof obj !== 'undefined'
}

export { filterNonNullish }
