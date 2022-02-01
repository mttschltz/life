import React from 'react'
import { Stack as GrommetStack, StackProps as GrommetStackProps } from 'grommet'
import { BoxProps } from './Box'

interface StackProps {
  anchor?: GrommetStackProps['anchor']
  fill?: BoxProps['fill']
}

const Stack: React.FC<StackProps> = (props) => {
  const { children, fill, ...forwardedProps } = props
  return (
    <GrommetStack fill={fill === 'both' ? true : fill} {...forwardedProps}>
      {children}
    </GrommetStack>
  )
}

export { Stack }
