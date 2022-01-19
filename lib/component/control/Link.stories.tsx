import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Link, GatsbyLink } from './Link'
import styled from 'styled-components'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

const Simple: ComponentStory<typeof Link> = () => {
  return (
    <>
      <Divider>
        <Link href="https://www.wikipedia.org">Wikipedia</Link>
      </Divider>
      <Divider>
        <GatsbyLink to="/internal-link">Internal Link</GatsbyLink>
      </Divider>
    </>
  )
}

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Control/Link',
} as ComponentMeta<typeof Link>
