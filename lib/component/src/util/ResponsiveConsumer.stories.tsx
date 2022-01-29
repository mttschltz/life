import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { Box } from '@component'
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
        <ResponsiveConsumer>{(size): ReactNode => <Box>size: {size}</Box>}</ResponsiveConsumer>
      </Divider>
      <Divider>
        <GrommetResponsiveContext.Provider value="custom provider value">
          <ResponsiveConsumer>{(size): ReactNode => <Box>size: {size}</Box>}</ResponsiveConsumer>
        </GrommetResponsiveContext.Provider>
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
