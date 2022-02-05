import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import styled from 'styled-components'
import { Position } from './Position'
import { Text } from '@component'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

/* eslint-disable react/no-unescaped-entities */
const Simple: ComponentStory<typeof Position> = () => {
  return (
    <>
      <Divider>
        <Text>Default anchor</Text>
        <Position>
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Position>
      </Divider>
      <Divider>
        <Text>Center anchor</Text>
        <Position anchor="center">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Position>
      </Divider>
      <Divider>
        <Text>Left anchor</Text>
        <Position anchor="left">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Position>
      </Divider>
      <Divider>
        <Text>Top-right anchor</Text>
        <Position anchor="top-right">
          <Box background="brand" width="100%" height="small" />
          <Box background="border" width="xxsmall" height="xxsmall" />
        </Position>
      </Divider>
      <Divider>
        <Text>No fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Position anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>No fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Position anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Horizontal fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Position fill="horizontal" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Horizontal fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Position fill="horizontal" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Vertical fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Position fill="vertical" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Vertical fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Position fill="vertical" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Both fill (parent direction: row)</Text>
        <Box width="small" height="small" background="brand" justify="start" align="start">
          <Position fill="both" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
      <Divider>
        <Text>Both fill (parent direction: column)</Text>
        <Box width="small" height="small" background="brand" direction="column" justify="start" align="start">
          <Position fill="both" anchor="bottom-right">
            <Box width="xxsmall" height="xxsmall" background="border" />
            <Box width="xxsmall" height="xxsmall" background="graph-1" />
          </Position>
        </Box>
      </Divider>
    </>
  )
}
/* eslint-enable react/no-unescaped-entities */

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Position',
  component: Position,
} as ComponentMeta<typeof Position>
