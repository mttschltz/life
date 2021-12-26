import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Icon, ICON_NAMES } from './Icon'
import { ThemeProvider } from '@component/util/theme-provider'
import styled from 'styled-components'
import { Box } from '@component/layout/Box'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Icon> = () => {
  return (
    <>
      <Divider>
        Default:
        <Box background="brand">
          {ICON_NAMES.map((n, i) => (
            <Box key={i} background="border" pad="xxsmall">
              <Icon name={n} />
            </Box>
          ))}
        </Box>
      </Divider>
      <Divider>
        Small:
        <Box background="brand">
          {ICON_NAMES.map((n, i) => (
            <Box key={i} background="border" pad="xxsmall">
              <Icon name={n} size="small" />
            </Box>
          ))}
        </Box>
      </Divider>
      <Divider>
        Medium:
        <Box background="brand">
          {ICON_NAMES.map((n, i) => (
            <Box key={i} background="border" pad="xxsmall">
              <Icon name={n} size="medium" />
            </Box>
          ))}
        </Box>
      </Divider>
      <Divider>
        Large:
        <Box background="brand">
          {ICON_NAMES.map((n, i) => (
            <Box key={i} background="border" pad="xxsmall">
              <Icon name={n} size="large" />
            </Box>
          ))}
        </Box>
      </Divider>
      <Divider>
        XLarge:
        <Box background="brand">
          {ICON_NAMES.map((n, i) => (
            <Box key={i} background="border" pad="xxsmall">
              <Icon name={n} size="xlarge" />
            </Box>
          ))}
        </Box>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Visualizations/Icon',
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/naming-convention
    (Story) => (
      <>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </>
    ),
  ],
} as ComponentMeta<typeof Icon>
