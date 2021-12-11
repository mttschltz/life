import { Grommet } from 'grommet'
import React from 'react'
import { THEME } from '@component/theme'

const ThemeProvider: React.FC = (props) => {
  return <Grommet theme={THEME}>{props.children}</Grommet>
}

export { ThemeProvider }
