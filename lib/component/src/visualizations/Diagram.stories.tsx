import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { Diagram } from './Diagram'
import { Box } from '@component/layout/Box'
import { Position } from '@component'

const Divider = styled.div`
  max-width: 50rem;
  padding-bottom: 5rem;
`

const Simple: ComponentStory<typeof Diagram> = () => {
  // Make IDs unique as this component duplicated for dark mode
  const idPrefix = Math.floor(Math.random() * 1000000).toString()
  const id = (idName: string): string => `${idPrefix}-${idName}`

  return (
    <>
      <Divider>
        <Position>
          <Box direction="column">
            <Box>
              <Box id={id('rect-top')} background="brand" pad="xsmall">
                Top
              </Box>
            </Box>
            <Box justify="between" margin={{ top: 'large' }}>
              <Box id={id('rect-one')} background="border" pad="xsmall">
                One
              </Box>
              <Box id={id('rect-two')} background="border" pad="xsmall">
                Two
              </Box>
              <Box id={id('rect-three')} background="border" pad="xsmall">
                Three
              </Box>
            </Box>
          </Box>
          <Diagram
            connections={[
              {
                fromTarget: id('rect-top'),
                toTarget: id('rect-one'),
                thickness: 'xsmall',
                type: 'rectilinear',
                color: 'graph-0',
                anchor: 'vertical',
              },
              {
                fromTarget: id('rect-top'),
                toTarget: id('rect-two'),
                thickness: 'xsmall',
                type: 'rectilinear',
                color: 'graph-1',
                anchor: 'vertical',
              },
              {
                fromTarget: id('rect-top'),
                toTarget: id('rect-three'),
                thickness: 'xsmall',
                type: 'rectilinear',
                color: 'graph-0',
                anchor: 'vertical',
              },
            ]}
          />
        </Position>
      </Divider>
      <Divider>
        <Position>
          <Box direction="column">
            <Box>
              <Box id={id('curved-top')} background="brand" pad="xsmall">
                Top
              </Box>
            </Box>
            <Box justify="between" margin={{ top: 'large' }}>
              <Box id={id('curved-one')} background="border" pad="xsmall">
                One
              </Box>
              <Box id={id('curved-two')} background="border" pad="xsmall">
                Two
              </Box>
              <Box id={id('curved-three')} background="border" pad="xsmall">
                Three
              </Box>
            </Box>
          </Box>
          <Diagram
            connections={[
              {
                fromTarget: id('curved-top'),
                toTarget: id('curved-one'),
                thickness: 'hair',
                type: 'curved',
                color: 'graph-0',
                anchor: 'vertical',
              },
              {
                fromTarget: id('curved-top'),
                toTarget: id('curved-two'),
                thickness: 'hair',
                type: 'curved',
                color: 'graph-1',
                anchor: 'vertical',
              },
              {
                fromTarget: id('curved-top'),
                toTarget: id('curved-three'),
                thickness: 'hair',
                type: 'curved',
                color: 'graph-0',
                anchor: 'vertical',
              },
            ]}
          />
        </Position>
      </Divider>
      <Divider>
        <Position>
          <Box width="100%" justify="between">
            <Box align="center">
              <Box id={id('direct-top')} background="brand" pad="xsmall">
                Top
              </Box>
            </Box>
            <Box justify="between" gap="large" direction="column" margin={{ left: 'large' }}>
              <Box id={id('direct-one')} background="border" pad="xsmall">
                One
              </Box>
              <Box id={id('direct-two')} background="border" pad="xsmall">
                Two
              </Box>
              <Box id={id('direct-three')} background="border" pad="xsmall">
                Three
              </Box>
            </Box>
          </Box>
          <Diagram
            connections={[
              {
                fromTarget: id('direct-top'),
                toTarget: id('direct-one'),
                thickness: 'medium',
                type: 'direct',
                color: 'graph-0',
                anchor: 'horizontal',
              },
              {
                fromTarget: id('direct-top'),
                toTarget: id('direct-two'),
                thickness: 'medium',
                type: 'direct',
                color: 'graph-1',
                anchor: 'horizontal',
              },
              {
                fromTarget: id('direct-top'),
                toTarget: id('direct-three'),
                thickness: 'medium',
                type: 'direct',
                color: 'graph-0',
                anchor: 'horizontal',
              },
            ]}
          />
        </Position>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Visualizations/Diagram',
} as ComponentMeta<typeof Diagram>
