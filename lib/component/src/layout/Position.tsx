import React from 'react'
import { Stack as GrommetStack, StackProps as GrommetStackProps } from 'grommet'
import { BoxProps } from './Box'
import { BaseProps, setTestId } from '@component/Base'

interface PositionProps extends BaseProps {
  anchor?: GrommetStackProps['anchor']
  fill?: BoxProps['fill']
}

const Position: React.FC<PositionProps> = (props) => {
  const { children, fill, testId, ...forwardedProps } = props
  return (
    <GrommetStack fill={fill === 'both' ? true : fill} {...forwardedProps} {...setTestId('Position', testId)}>
      {children}
    </GrommetStack>
  )
}

export { Position as Position }
