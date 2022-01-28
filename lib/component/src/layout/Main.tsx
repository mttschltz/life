import React from 'react'
import { Main as GrommetMain } from 'grommet'
import { BoxProps } from './Box'

type MainProps = BoxProps

const Main: React.FC<MainProps> = (props) => {
  const { children, fill, direction = 'row', ...forwardedProps } = props
  return (
    <GrommetMain fill={fill === 'both' ? true : fill} direction={direction} {...forwardedProps}>
      {children}
    </GrommetMain>
  )
}

export { Main }
