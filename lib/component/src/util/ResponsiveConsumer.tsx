import { ResponsiveContext as GrommetResponsiveContext } from 'grommet'
import React, { ReactNode } from 'react'
import { Breakpoint, BREAKPOINTS } from './theme'

interface ResponsiveConsumerProps {
  children: (value: Breakpoint) => ReactNode
}

const isBreakpoint = (size: string): size is Breakpoint => {
  return BREAKPOINTS.includes(size)
}

const ResponsiveConsumer: React.FC<ResponsiveConsumerProps> = (props) => {
  const { children, ...forwardedProps } = props
  const forwardedChildren: (size: string) => ReactNode = (value) => {
    if (!isBreakpoint(value)) {
      return null
    }
    return children(value)
  }

  return <GrommetResponsiveContext.Consumer {...forwardedProps}>{forwardedChildren}</GrommetResponsiveContext.Consumer>
}

export { ResponsiveConsumer }
