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
        <Heading level={1} size="small">
          Level 1, size small
        </Heading>
        <Heading level={2} size="small">
          Level 2, size small
        </Heading>
        <Heading level={3} size="small">
          Level 3, size small
        </Heading>
        <Heading level={4} size="small">
          Level 4, size small
        </Heading>
        <Heading level={1} size="medium">
          Level 1, size medium
        </Heading>
        <Heading level={2} size="medium">
          Level 2, size medium
        </Heading>
        <Heading level={3} size="medium">
          Level 3, size medium
        </Heading>
        <Heading level={4} size="medium">
          Level 4, size medium
        </Heading>
        <Heading level={1} size="large">
          Level 1, size large
        </Heading>
        <Heading level={2} size="large">
          Level 2, size large
        </Heading>
        <Heading level={3} size="large">
          Level 3, size large
        </Heading>
        <Heading level={4} size="large">
          Level 4, size large
        </Heading>
        <Heading level={1} size="xlarge">
          Level 1, size xlarge
        </Heading>
        <Heading level={2} size="xlarge">
          Level 2, size xlarge
        </Heading>
        <Heading level={3} size="xlarge">
          Level 3, size xlarge
        </Heading>
        <Heading level={4} size="xlarge">
          Level 4, size xlarge
        </Heading>
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
