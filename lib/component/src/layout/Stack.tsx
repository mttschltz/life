import React from 'react'
import { Stack as GrommetStack, StackProps as GrommetStackProps } from 'grommet'
import { BoxProps } from './Box'
import { BaseProps, setTestId } from '@component/Base'

interface StackProps extends BaseProps {
  anchor?: GrommetStackProps['anchor']
  fill?: BoxProps['fill']
}

const Stack: React.FC<StackProps> = (props) => {
  const { children, fill, testId, ...forwardedProps } = props
  return (
    <GrommetStack fill={fill === 'both' ? true : fill} {...forwardedProps} {...setTestId('Stack', testId)}>
      {children}
    </GrommetStack>
  )
}

export { Stack }
