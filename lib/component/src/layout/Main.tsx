import React from 'react'
import { Main as GrommetMain } from 'grommet'
import { BoxProps } from './Box'
import { setTestId } from '@component/Base'

type MainProps = BoxProps

const Main: React.FC<MainProps> = (props) => {
  const { children, fill, direction = 'row', testId, ...forwardedProps } = props
  return (
    <GrommetMain
      {...forwardedProps}
      fill={fill === 'both' ? true : fill}
      direction={direction}
      {...setTestId('Box', testId)}
    >
      {children}
    </GrommetMain>
  )
}

export { Main }
