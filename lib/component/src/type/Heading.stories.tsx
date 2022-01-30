import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Heading } from './Heading'
import styled from 'styled-components'
import { Box } from '@component'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Heading> = () => {
  return (
    <>
      <Divider>
        <Heading level={1}>Level 1</Heading>
        <Heading level={2}>Level 2</Heading>
        <Heading level={3}>Level 3</Heading>
        <Heading level={4}>Level 4</Heading>
      </Divider>
      <Divider>
        <Box background="brand">
          <Heading level={4}>Heading default margin</Heading>
        </Box>
        <Box background="border">
          <Heading level={4} margin="small">
            Margin small
          </Heading>
        </Box>
        <Box background="brand">
          <Heading level={4} margin={{ top: 'xsmall', bottom: 'none' }}>
            Margin top xsmall, bottom none
          </Heading>
        </Box>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Type/Heading',
} as ComponentMeta<typeof Heading>
