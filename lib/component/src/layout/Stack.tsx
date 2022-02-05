import React from 'react'
import { Box, BoxProps } from './Box'
import { BaseProps, setTestId } from '@component/Base'

// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
type StackProps = Pick<BoxProps, 'gap'> & BaseProps

const Stack: React.FC<StackProps> = (props) => {
  const { children, testId, ...forwardedProps } = props
  return (
    <Box {...forwardedProps} {...setTestId('Stack', testId)} width="100%" direction="column">
      {children}
    </Box>
  )
}

export { Stack }
