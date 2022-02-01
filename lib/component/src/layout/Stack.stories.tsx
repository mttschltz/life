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
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Center anchor</Text>
        <Stack anchor="center">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Left anchor</Text>
        <Stack anchor="left">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>Top-right anchor</Text>
        <Stack anchor="top-right">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Stack>
      </Divider>
      <Divider>
        <Text>No fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Stack anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>No fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Stack anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Horizontal fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Stack fill="horizontal" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Horizontal fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Stack fill="horizontal" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Vertical fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Stack fill="vertical" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Vertical fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Stack fill="vertical" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Both fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Stack fill="both" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Both fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Stack fill="both" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Stack>
        </Box>
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
