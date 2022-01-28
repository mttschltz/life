import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import styled from 'styled-components'
import { Header } from './Header'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Header> = () => {
  return (
    <>
      <Divider>
        <Header background="brand">
          <Box>Left</Box>
          <Box>Middle</Box>
          <Box>Right</Box>
        </Header>
      </Divider>
      <Divider>
        <Header background="border" direction="column" gap="small" align="start">
          <Box>Top</Box>
          <Box>Bottom</Box>
        </Header>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Header',
  component: Header,
} as ComponentMeta<typeof Header>
