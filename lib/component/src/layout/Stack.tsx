import React from 'react'
import { Box, BoxProps } from './Box'
import { BaseProps, setTestId } from '@component/Base'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  > * {
    /* Disable flex-shrink in children, otherwise children who are Box elements and have
       min-height:0 will be given no height. */
    flex: 0 0 auto;
  }
`

// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
type StackProps = Pick<BoxProps, 'gap'> & BaseProps

const Stack: React.FC<StackProps> = (props) => {
  const { children, testId, ...forwardedProps } = props
  return (
    <StyledBox {...forwardedProps} {...setTestId('Stack', testId)} width="100%" direction="column">
      {children}
    </StyledBox>
  )
}

export { Stack }
