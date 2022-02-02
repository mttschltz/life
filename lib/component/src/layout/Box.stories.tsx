import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import styled from 'styled-components'

const PARAM_NO_PROVIDER = 'PARAM_NO_PROVIDER'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const DividerNoWidth = styled.div`
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Box> = () => {
  return (
    <>
      <Divider>
        <Box background="brand">Default</Box>
      </Divider>
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
      <Divider>
        <Box background="brand" direction="column">
          <Box>Direction</Box>
          <Box>is</Box>
          <Box>Column</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" direction="column-reverse">
          <Box>Direction</Box>
          <Box>is</Box>
          <Box>Column Reverse</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="xsmall">
          <Box background="border" flex="grow">
            flex grow
          </Box>
        </Box>
      </Divider>
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
      <Divider>
        <Box background="brand" height="small" width="small" align="start">
          <Box background="border" fill="horizontal">
            fill horizontal
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" width="small" align="start">
          <Box background="border" fill="vertical">
            fill vertical
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="small" width="small" align="start">
          <Box background="border" fill="both">
            fill both
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" gap="medium">
          <Box background="border">With</Box>
          <Box background="border">medium</Box>
          <Box background="border">gap</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" justify="between">
          <Box background="border">justify</Box>
          <Box background="border">as</Box>
          <Box background="border">between</Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" justify="center">
          <Box background="border">justify</Box>
          <Box background="focus">as</Box>
          <Box background="border">center</Box>
        </Box>
      </Divider>
    </>
  )
}

// Test all possible `pad` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
const Padding: ComponentStory<typeof Box> = () => {
  return (
    <>
      <Divider>
        <Box background="brand" pad="xxsmall">
          <Box fill="both" background="border">
            pad xxsmall
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad="small">
          <Box fill="both" background="border">
            pad small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad="none">
          <Box fill="both" background="border">
            pad none
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ bottom: 'small' }}>
          <Box fill="both" background="border">
            bottom: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ end: 'small' }}>
          <Box fill="both" background="border">
            end: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ horizontal: 'small' }}>
          <Box fill="both" background="border">
            horizontal: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ left: 'small' }}>
          <Box fill="both" background="border">
            left: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ right: 'small' }}>
          <Box fill="both" background="border">
            right: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ start: 'small' }}>
          <Box fill="both" background="border">
            start: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ top: 'small' }}>
          <Box fill="both" background="border">
            top: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" pad={{ vertical: 'small' }}>
          <Box fill="both" background="border">
            vertical: small
          </Box>
        </Box>
      </Divider>
    </>
  )
}
// Test all possible `margin` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
const Margin: ComponentStory<typeof Box> = () => {
  return (
    <>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin="xxsmall" background="border">
            margin xxsmall
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin="small" background="border">
            margin small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin="none" background="border">
            margin none
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ bottom: 'small' }} background="border">
            bottom: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ end: 'small' }} background="border">
            end: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ horizontal: 'small' }} background="border">
            horizontal: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ left: 'small' }} background="border">
            left: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ right: 'small' }} background="border">
            right: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ start: 'small' }} background="border">
            start: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ top: 'small' }} background="border">
            top: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ vertical: 'small' }} background="border">
            vertical: small
          </Box>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand">
          <Box fill="both" margin={{ horizontal: 'none', vertical: 'xsmall' }} background="border">
            horizontal: none, vertical: xsmall
          </Box>
        </Box>
      </Divider>
    </>
  )
}

// Test all possible `background` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
const Background: ComponentStory<typeof Box> = () => {
  return (
    <>
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
      <Divider>
        <Box background="background-back" pad="medium">
          background
        </Box>
      </Divider>
      <Divider>
        <Box background={{ color: 'background', dark: true }} pad="medium">
          force dark background
        </Box>
      </Divider>
      <Divider>
        <Box background={{ color: 'background', dark: false }} pad="medium">
          force light background
        </Box>
      </Divider>
      <Divider>
        <Box height="xsmall">
          <Box background={{ light: 'brand', dark: 'border' }}>brand for light mode, border for dark mode</Box>
        </Box>
      </Divider>
    </>
  )
}
Background.parameters = {
  [PARAM_NO_PROVIDER]: true,
}

// Test all possible `align` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
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

// Test all possible `height` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
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

// Test all possible `width` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
const Width: ComponentStory<typeof Box> = () => {
  return (
    <>
      <DividerNoWidth>
        <Box background="brand" width="xxsmall">
          xxsmall
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="xsmall">
          xsmall
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="small">
          small
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="medium">
          medium
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="large">
          large
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="xlarge">
          xlarge
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="xxlarge">
          xxlarge
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width="medium" height="xsmall">
          <Box background="border" width="100%">
            100%
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand" width={{ width: 'small' }}>
          small - using object
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box background="border" width={{ min: 'small' }}>
            min small
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box background="border" width={{ min: 'small' }}>
            min small - “Live a good life. If there are gods and they are just, then they will not care how devout you
            have been, but will welcome you based on the virtues you have lived by. If there are gods, but unjust, then
            you should not want to worship them. If there are no gods, then you will be gone, but will have lived a
            noble life that will live on in the memories of your loved ones.”
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box background="border" width={{ max: 'small' }}>
            max small
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box background="border" width={{ max: 'small' }}>
            max small - “Whenever you are about to find fault with someone, ask yourself the following question: What
            fault of mine most nearly resembles the one I am about to criticize?”
          </Box>
        </Box>
      </DividerNoWidth>
    </>
  )
}

// Test all possible `width` values as it does not directly point to the Grommet type and, thus, is
// more fragile to bugs when updating Grommet.
const Basis: ComponentStory<typeof Box> = () => {
  return (
    <>
      <DividerNoWidth>
        <Box background="brand">
          <Box background="border">Default</Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="1/2" background="border">
            1/2
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="1/3" background="border">
            1/3
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="2/3" background="border">
            2/3
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="1/4" background="border">
            1/4
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="2/4" background="border">
            2/4
          </Box>
        </Box>
      </DividerNoWidth>
      <DividerNoWidth>
        <Box background="brand">
          <Box basis="3/4" background="border">
            3/4
          </Box>
        </Box>
      </DividerNoWidth>
    </>
  )
}

export { Simple, Align, Background, Height, Margin, Padding, Width, Basis }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Box',
  component: Box,
} as ComponentMeta<typeof Box>
