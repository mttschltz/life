import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { Text } from './Text'
import { Box } from '@component/layout/Box'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 1rem;
`

const Simple: ComponentStory<typeof Text> = () => {
  return (
    <>
      <Divider>
        <Text>Default</Text>
      </Divider>
      <Divider>
        <Text size="xsmall">xsmall</Text>
      </Divider>
      <Divider>
        <Text size="small">small</Text>
      </Divider>
      <Divider>
        <Text size="medium">medium</Text>
      </Divider>
      <Divider>
        <Text size="large">large</Text>
      </Divider>
      <Divider>
        <Text size="xlarge">xlarge</Text>
      </Divider>
      <Divider>
        <Text size="xxlarge">xxlarge</Text>
      </Divider>
      <Divider>
        <Text size="2xl">2xl</Text>
      </Divider>
      <Divider>
        <Text size="3xl">3xl</Text>
      </Divider>
      <Divider>
        <Text size="4xl">4xl</Text>
      </Divider>
      <Divider>
        <Text size="5xl">5xl</Text>
      </Divider>
      <Divider>
        <Text size="6xl">6xl</Text>
      </Divider>
      <Divider>
        <Text weight="bold">weight bold</Text>
      </Divider>
      <Divider>
        <Text weight="bolder">weight bolder</Text>
      </Divider>
      <Divider>
        <Text weight="lighter">weight lighter</Text>
      </Divider>
      <Divider>
        <Text weight="normal">weight normal</Text>
      </Divider>
      <Divider>
        <Text weight="normal">weight normal</Text>
      </Divider>
      <Divider>
        <Text weight="normal">Default color</Text>
      </Divider>
      <Divider>
        <Text weight="normal" color="text">
          Text color
        </Text>
      </Divider>
      <Divider>
        <Text weight="normal" color="brand">
          Custom color
        </Text>
      </Divider>
      <Divider>
        <Box background="text">
          <Text weight="normal" color="brand">
            Custom color on dark background
          </Text>
        </Box>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Type/Text',
} as ComponentMeta<typeof Text>
