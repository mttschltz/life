import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import styled from 'styled-components'
import { Stack } from './Stack'
import { Text } from '@component'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

/* eslint-disable react/no-unescaped-entities */
const Simple: ComponentStory<typeof Stack> = () => {
  return (
    <>
      <Divider>
        <Text>Default anchor</Text>
        <Stack>
          <Box background="brand" pad="large" />
          <Box background="border" pad="xsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Center anchor</Text>
        <Stack anchor="center">
          <Box background="brand" pad="large" />
          <Box background="border" pad="xsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Left anchor</Text>
        <Stack anchor="left">
          <Box background="brand" pad="large" />
          <Box background="border" pad="xsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Top-right anchor</Text>
        <Stack anchor="top-right">
          <Box background="brand" pad="large" />
          <Box background="border" pad="xsmall" />
        </Stack>
      </Divider>
    </>
  )
}
/* eslint-enable react/no-unescaped-entities */

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Stack',
  component: Stack,
} as ComponentMeta<typeof Stack>
