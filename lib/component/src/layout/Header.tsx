import React from 'react'
import { Header as GrommetHeader } from 'grommet'
import { BoxProps } from './Box'
import { setTestId } from '@component/Base'

type HeaderProps = BoxProps

const Header: React.FC<HeaderProps> = (props) => {
  const { children, fill, direction = 'row', testId, ...forwardedProps } = props
  return (
    <GrommetHeader
      {...forwardedProps}
      fill={fill === 'both' ? true : fill}
      direction={direction}
      {...setTestId('Header', testId)}
    >
      {children}
    </GrommetHeader>
  )
}

export { Header }
