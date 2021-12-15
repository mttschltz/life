import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import { ThemeProvider } from '@component/util/theme-provider'
import styled from 'styled-components'

const PARAM_NO_PROVIDER = 'PARAM_NO_PROVIDER'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Box> = () => {
  return (
    <>
      <ThemeProvider>
        <Divider>
          <Box background="brand">Default</Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" as="ul">
            <Box background="border" as="li">
              As li
            </Box>
            <Box background="border" as="li">
              As li
            </Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" direction="column">
            <Box>Direction</Box>
            <Box>is</Box>
            <Box>Column</Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" direction="column-reverse">
            <Box>Direction</Box>
            <Box>is</Box>
            <Box>Column Reverse</Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" height="xsmall">
            <Box background="border" flex="grow">
              flex grow
            </Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" height="xsmall">
            <Box background="border" flex={{ grow: 1 }}>
              flex grow 1
            </Box>
            <Box background="focus" flex={{ grow: 3 }}>
              flex grow 3
            </Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" height="xsmall">
            <Box flex={{ shrink: 0 }} background="border">
              shrink 0 - “He who is brave is free”
            </Box>
            <Box flex={{ shrink: 1 }} background="focus">
              shrink 1 - “He who is brave is free”
            </Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" gap="medium">
            <Box background="border">With</Box>
            <Box background="border">medium</Box>
            <Box background="border">gap</Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" justify="between">
            <Box background="border">justify</Box>
            <Box background="border">as</Box>
            <Box background="border">between</Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" justify="center">
            <Box background="border">justify</Box>
            <Box background="focus">as</Box>
            <Box background="border">center</Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="brand" justify="center" height="small">
            <Box
              background={{
                color: 'focus',
                opacity: 'weak',
              }}
            >
              weak opacity
            </Box>
            <Box
              background={{
                color: 'focus',
                opacity: 'medium',
              }}
            >
              medium opacity
            </Box>
            <Box
              background={{
                color: 'focus',
                opacity: 'strong',
              }}
            >
              strong opacity
            </Box>
          </Box>
        </Divider>
      </ThemeProvider>
      <ThemeProvider>
        <Divider>
          <Box background="background-back" pad="medium">
            background in light mode context
          </Box>
        </Divider>
      </ThemeProvider>
      <Divider>
        <ThemeProvider>
          <Box background={{ color: 'background', dark: true }} pad="medium">
            force dark background in light mode context
          </Box>
        </ThemeProvider>
      </Divider>
      <Divider>
        <ThemeProvider mode="dark">
          <Box height="xsmall">
            <Box background="border">border background in dark mode context</Box>
          </Box>
        </ThemeProvider>
      </Divider>
      <Divider>
        <ThemeProvider>
          <Box height="xsmall">
            <Box background="border">border background in light mode context</Box>
          </Box>
        </ThemeProvider>
      </Divider>
      <Divider>
        <ThemeProvider>
          <Box height="xsmall">
            <Box background={{ light: 'brand', dark: 'border' }}>
              light mode context, with light as brand, dark as border
            </Box>
          </Box>
        </ThemeProvider>
      </Divider>
      <Divider>
        <ThemeProvider mode="dark">
          <Box height="xsmall">
            <Box background={{ light: 'brand', dark: 'border' }}>
              dark mode context, with light as brand, dark as border
            </Box>
          </Box>
        </ThemeProvider>
      </Divider>
    </>
  )
}
Simple.parameters = {
  [PARAM_NO_PROVIDER]: true,
}

// Test all variants as `align` does not have a type safe mapping to Grommet types.
const Align: ComponentStory<typeof Box> = () => {
  return (
    <>
      <Divider>
        <Box background="brand" height="small">
          <Box background="border">Align</Box>
          <Box background="border">default</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="baseline">
          <Box background="border">Align</Box>
          <Box background="border">baseline</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="center">
          <Box background="border">Align</Box>
          <Box background="border">center</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="end">
          <Box background="border">Align</Box>
          <Box background="border">end</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="start">
          <Box background="border">Align</Box>
          <Box background="border">start</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="stretch">
          <Box background="border">Align</Box>
          <Box background="border">stretch</Box>
        </Box>
      </Divider>
    </>
  )
}

// Test all variants as `height` does not have a type safe mapping to Grommet types.
const Height: ComponentStory<typeof Box> = () => {
  return (
    <>
      <Divider>
        <Box background="brand" height="xxsmall">
          xxsmall
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="xsmall">
          xsmall
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small">
          small
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="medium">
          medium
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="large">
          large
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="xlarge">
          xlarge
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="xxlarge">
          xxlarge
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" align="start">
          <Box background="border" height="100%">
            100%
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height={{ min: 'xsmall' }} align="start">
          min xsmall
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height={{ min: 'xsmall' }} align="start">
          <Box>
            min xsmall - “Live a good life. If there are gods and they are just, then they will not care how devout you
            have been, but will welcome you based on the virtues you have lived by. If there are gods, but unjust, then
            you should not want to worship them. If there are no gods, then you will be gone, but will have lived a
            noble life that will live on in the memories of your loved ones.”
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height={{ max: 'xsmall' }} align="start">
          max xsmall
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height={{ max: 'xsmall' }} align="start">
          <Box>
            “Whenever you are about to find fault with someone, ask yourself the following question: What fault of mine
            most nearly resembles the one I am about to criticize?”
          </Box>
        </Box>
      </Divider>
    </>
  )
}

export { Simple, Align, Height }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Box',
  component: Box,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/naming-convention
    (Story, context) => (
      <>
        {context.parameters[PARAM_NO_PROVIDER] ? (
          <Story />
        ) : (
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        )}
      </>
    ),
  ],
} as ComponentMeta<typeof Box>
