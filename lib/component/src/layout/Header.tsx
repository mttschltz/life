import React from 'react'
import { Header as GrommetHeader } from 'grommet'
import { BoxProps } from './Box'

type HeaderProps = BoxProps

const Header: React.FC<HeaderProps> = (props) => {
  const { children, fill, direction = 'row', ...forwardedProps } = props
  return (
    <GrommetHeader fill={fill === 'both' ? true : fill} direction={direction} {...forwardedProps}>
      {children}
    </GrommetHeader>
  )
}

export { Header }
