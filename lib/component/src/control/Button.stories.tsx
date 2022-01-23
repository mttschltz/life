import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from './Button'

const Kind: ComponentStory<typeof Button> = () => {
  return (
    <>
      <Button context="primary">Primary</Button>
      <Button>Default</Button>
    </>
  )
}

export { Kind }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Controls/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>
