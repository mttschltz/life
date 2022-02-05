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

const Simple: ComponentStory<typeof Stack> = () => {
  return (
    <>
      <Divider>
        <Text>Default</Text>
        <Box>
          <Stack>
            <Box background="brand">One</Box>
            <Box background="border">Two</Box>
            <Box background="brand">Three</Box>
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Gap medium</Text>
        <Box>
          <Stack gap="medium">
            <Box background="brand" width="100%">
              One
            </Box>
            <Box background="border" width="100%">
              Two
            </Box>
            <Box background="brand" width="100%">
              Three
            </Box>
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Parent has height</Text>
        <Box height="medium" background="focus">
          <Stack gap="medium">
            <Box background="brand" width="100%">
              One
            </Box>
            <Box background="border" width="100%">
              Two
            </Box>
            <Box background="brand" width="100%">
              Three
            </Box>
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Stacks as two columns</Text>
        <Box background="focus">
          <Stack>
            <Box background="brand" width="100%">
              One
            </Box>
            <Box background="border" width="100%">
              Two
            </Box>
            <Box background="brand" width="100%">
              Three
            </Box>
          </Stack>
          <Stack>
            <Box background="brand" width="100%">
              Four
            </Box>
            <Box background="border" width="100%">
              Five
            </Box>
            <Box background="brand" width="100%">
              Six
            </Box>
          </Stack>
        </Box>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Stack',
  component: Stack,
} as ComponentMeta<typeof Stack>
