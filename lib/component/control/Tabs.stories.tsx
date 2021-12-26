import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Tabs, Tab } from './Tabs'
import { ThemeProvider } from '@component/util/theme-provider'
import styled from 'styled-components'
import { Box } from '@component'
import { Icon } from '@component/visualizations/Icon'

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
          <Tab title="Tab title 1" icon={<Icon name="checkbox-selected"></Icon>}>
            <Box background="brand">Tab 1 content</Box>
          </Tab>
          <Tab title="Tab title 2" icon={<Icon name="plan"></Icon>}>
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
  title: 'Control/Tabs',
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/naming-convention
    (Story) => (
      <>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </>
    ),
  ],
} as ComponentMeta<typeof Tabs>
