import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { Box, Button, Stack, Text } from '@component'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

/* eslint-disable react/no-unescaped-entities */
const Simple: ComponentStory<typeof Button> = () => {
  return (
    <>
      <Divider>
        <Text>Default size:</Text>
        <Box gap="small" direction="row-responsive">
          <Button>Default</Button>
          <Button context="primary">Primary</Button>
        </Box>
      </Divider>
      <Divider>
        <Text>Small size:</Text>
        <Box gap="small" direction="row-responsive">
          <Button size="small">Default</Button>
          <Button size="small" context="primary">
            Primary
          </Button>
        </Box>
      </Divider>
      <Divider>
        <Text>Medium size:</Text>
        <Box gap="small" direction="row-responsive">
          <Button size="medium">Default</Button>
          <Button size="medium" context="primary">
            Primary
          </Button>
        </Box>
      </Divider>
      <Divider>
        <Text>Large size:</Text>
        <Box gap="small" direction="row-responsive">
          <Button size="large">Default</Button>
          <Button size="large" context="primary">
            Primary
          </Button>
        </Box>
      </Divider>
      <Divider>
        <Box gap="small" direction="row-responsive">
          <Button href="https://www.matt.fyi">With href</Button>
        </Box>
      </Divider>
      <Divider>
        <Text>Behind stacked Box without raisePosition</Text>
        <Box width="small" height="small" background="graph-1">
          <Stack fill="both" anchor="top-right">
            <Box fill="both" justify="start" align="start">
              <Button href="https://www.matt.fyi">Without raisePosition</Button>
            </Box>
            <Box width="small" height="small" background="border">
              Covering box
            </Box>
          </Stack>
        </Box>
      </Divider>
      <Divider>
        <Text>Behind stacked Box with raisePosition</Text>
        <Box width="small" height="small" background="graph-1">
          <Stack fill="both" anchor="top-right">
            <Box fill="both" justify="start" align="start">
              <Button raisePosition={true} href="https://www.matt.fyi">
                With raisePosition
              </Button>
            </Box>
            <Box width="small" height="small" background="border">
              Covering box
            </Box>
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
  title: 'Layout/Button',
  component: Button,
} as ComponentMeta<typeof Button>
