import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from './Button'
import { ThemeProvider } from '@component/util/theme-provider'

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
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/naming-convention
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as ComponentMeta<typeof Button>
