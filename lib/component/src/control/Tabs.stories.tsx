import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Tabs, Tab } from './Tabs'
import styled from 'styled-components'
import { Box } from '@component'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Tabs> = () => {
  return (
    <>
      <Divider>
        Simple:
        <Tabs>
          <Tab title="Tab title 1">
            <Box background="brand">Tab 1 content</Box>
          </Tab>
          <Tab title="Tab title 2">
            <Box background="brand">Tab 2 content</Box>
          </Tab>
        </Tabs>
      </Divider>
      <Divider>
        With Icons:
        <Tabs>
          <Tab title="Tab title 1" icon="checkbox-selected">
            <Box background="brand">Tab 1 content</Box>
          </Tab>
          <Tab title="Tab title 2" icon="plan">
            <Box background="brand">Tab 2 content</Box>
          </Tab>
        </Tabs>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Controls/Tabs',
} as ComponentMeta<typeof Tabs>
