import React from 'react'
import { Text as GrommetText } from 'grommet'
import type { TextType as GrommetTextType } from 'grommet'

// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

interface TextProps {
  size?: Size
  weight?: Exclude<GrommetTextType['weight'], number>
}

const Text: React.FC<TextProps> = (props) => {
  return <GrommetText {...props} />
}

export { Text }
