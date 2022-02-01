import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { Box, Text } from '@component'
import { ResponsiveConsumer } from './ResponsiveConsumer'
import { ResponsiveContext as GrommetResponsiveContext } from 'grommet'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof ResponsiveConsumer> = () => {
  return (
    <>
      <Divider>
        <Box background="brand" height="xsmall" direction="column">
          <Text>Valid breakpoint:</Text>
          <ResponsiveConsumer>{(size): ReactNode => <Box>size: {size}</Box>}</ResponsiveConsumer>
        </Box>
      </Divider>
      <Divider>
        <Box background="brand" height="xsmall" direction="column">
          <Text>Invalid breakpoint (should not render):</Text>
          <GrommetResponsiveContext.Provider value="invalid breakpoint">
            <ResponsiveConsumer>{(size): ReactNode => <Box>size: {size}</Box>}</ResponsiveConsumer>
          </GrommetResponsiveContext.Provider>
        </Box>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Util/ResponsiveConsumer',
  component: ResponsiveConsumer,
} as ComponentMeta<typeof ResponsiveConsumer>
