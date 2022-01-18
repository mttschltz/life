import { Box, ThemeProvider, THEME } from '@component'
import { grommet } from 'grommet'
import React, { useState, useEffect } from 'react'

const CUSTOM_THEMED = 'Custom Themed'
const THEMES = {
  base: {},
  mattfyi: THEME,
  grommet,
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: (a, b) => {
      const isCustom = a[1].kind.split('/')[2] === CUSTOM_THEMED
      if (isCustom) return 1
      return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
    },
  },
}

export const decorators = [
  (Story, context) => {
    const [theme, setTheme] = useState('mattfyi')
    useEffect(() => {
      setTheme(context.globals.theme)
    }, [context.globals.theme])

    /**
     * This demonstrates that custom themed stories are driven off the "base"
     * theme. Custom themed stories will live under a "CustomThemed" directory.
     *
     * This is from Grommet's official Storybook. Examples of its usage can be seen by looking at
     * "Custom Themed" subfolders in stories, e.g. https://storybook.grommet.io/?path=/story/controls-button-custom-themed-ts-custom--ts-custom&globals=theme:base
     */
    if (context.kind.split('/')[2] === CUSTOM_THEMED && theme !== 'base') {
      return (
        <Box align="center" pad="large">
          <Text size="large">
            {`Custom themed stories are only displayed in the
                "base" theme mode. To enable, select "base" from the
                Theme menu above.`}
          </Text>
        </Box>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flexBasis: '50%' }}>
          <ThemeProvider theme={THEMES[theme]} mode="light">
            <Story theme={THEMES[theme]} />
          </ThemeProvider>
        </div>
        <div style={{ flexBasis: '50%' }}>
          <ThemeProvider theme={THEMES[theme]} mode="dark">
            <Story theme={THEMES[theme]} />
          </ThemeProvider>
        </div>
      </div>
    )
  },
]

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'mattfyi',
    toolbar: {
      icon: 'circlehollow',
      items: ['base', 'mattfyi', 'grommet'],
      showName: true,
    },
  },
}
