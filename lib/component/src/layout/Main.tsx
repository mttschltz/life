import React from 'react'
import { Main as GrommetMain } from 'grommet'
import { BaseProps, setTestId } from '@component/Base'

type MainProps = BaseProps

const Main: React.FC<MainProps> = (props) => {
  const { children, testId, ...forwardedProps } = props
  return (
    <GrommetMain
      {...forwardedProps}
      direction="column"
      // Override fill=vertical to prevent setting height:100% which results in it having the same
      // height as it's parent (lots of whitespace at bottom)
      fill={undefined}
      {...setTestId('Main', testId)}
    >
      {children}
    </GrommetMain>
  )
}

export { Main }
