type DivProps = Pick<JSX.IntrinsicElements['div'], 'id'>

type BaseProps = DivProps & {
  testId?: string
}

const setTestId = (componentName: string, suffix?: string): { 'data-testid'?: string } => {
  return !suffix ? {} : { 'data-testid': `myi--${componentName}--${suffix.replace(/\s/g, '_')}` }
}

export { setTestId }
export type { BaseProps }
