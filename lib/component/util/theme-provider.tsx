import { Grommet } from 'grommet'
import type { GrommetExtendedProps } from 'grommet'
import React from 'react'
import { THEME } from '@component/theme'

interface ThemeProviderProps {
  mode?: GrommetExtendedProps['themeMode']
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  return (
    <Grommet theme={THEME} themeMode={props.mode}>
      {props.children}
    </Grommet>
  )
}

export { ThemeProvider }
