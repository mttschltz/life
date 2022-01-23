import { Grommet } from 'grommet'
import type { GrommetExtendedProps } from 'grommet'
import React from 'react'

interface ThemeProviderProps {
  mode?: GrommetExtendedProps['themeMode']
  theme: GrommetExtendedProps['theme']
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  return (
    <Grommet theme={props.theme} themeMode={props.mode}>
      {props.children}
    </Grommet>
  )
}

export { ThemeProvider }
