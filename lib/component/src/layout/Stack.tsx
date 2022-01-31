import React from 'react'
import { Stack as GrommetStack, StackProps as GrommetStackProps } from 'grommet'

interface StackProps {
  anchor?: GrommetStackProps['anchor']
}

const Stack: React.FC<StackProps> = (props) => {
  return <GrommetStack {...props}>{props.children}</GrommetStack>
}

export { Stack }
