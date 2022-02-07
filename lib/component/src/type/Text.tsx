import React from 'react'
import { Text as GrommetText } from 'grommet'
import type { TextType as GrommetTextType } from 'grommet'
import { BaseProps, setTestId } from '@component/Base'
import { BoxProps } from '@component/layout/Box'
import { Color } from '@component/util/theme'

// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

interface TextProps extends BaseProps {
  size?: Size
  weight?: Exclude<GrommetTextType['weight'], number>
  as?: GrommetTextType['as']
  color?: Color
}

const Text: React.FC<TextProps> = (props) => {
  const { testId, ...forwardedProps } = props

  let margin: BoxProps['margin']
  switch (props.as) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      margin = 'none'
      break
  }

  return <GrommetText {...forwardedProps} margin={margin} {...setTestId('Text', testId)} />
}

export { Text }
