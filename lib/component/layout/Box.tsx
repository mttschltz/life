import React from 'react'
import { Box as BoxGrommet } from 'grommet'
import type { BoxProps as BoxPropsGrommet } from 'grommet'
import type { EdgeSizeType } from 'grommet/utils'
import { Color } from '@component/theme'

type BackgroundObjectGrommet = Exclude<BoxPropsGrommet['background'], string | undefined>

type BackgroundObject = {
  dark?: Color | boolean
  light?: Color
  color?: Color
  opacity?: BackgroundObjectGrommet['opacity']
}

/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
type TshirtSizeType = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

type HeightType =
  | 'xxsmall'
  | 'xxlarge'
  | TshirtSizeType
  | '100%'
  | {
      // height omitted from here though it's in the Grommet type. It doesn't appear to have an effect, even when
      // used in the absense of max or min.
      max?: 'xxsmall' | 'xxlarge' | TshirtSizeType | '100%'
      min?: 'xxsmall' | 'xxlarge' | TshirtSizeType | '100%'
    }

type WidthType =
  | 'xxsmall'
  | 'xxlarge'
  | TshirtSizeType
  | '100%'
  | {
      width?: 'xxsmall' | 'xxlarge' | TshirtSizeType | '100%'
      max?: 'xxsmall' | 'xxlarge' | TshirtSizeType | '100%'
      min?: 'xxsmall' | 'xxlarge' | TshirtSizeType | '100%'
    }
/* eslint-enable @typescript-eslint/sort-type-union-intersection-members */

interface BoxProps {
  // `align` does not have a type safe mapping to Grommet types.
  // This is due to Grommet's align type being a union with `string`.
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch'
  as?: BoxPropsGrommet['as']
  direction?: BoxPropsGrommet['direction']
  flex?: BoxPropsGrommet['flex']
  // `gap` does not have a type safe mapping to Grommet types.
  // This is due to Grommet's GapType being a union with `string`.
  gap?: EdgeSizeType | 'none'
  justify?: BoxPropsGrommet['justify']
  background?: BackgroundObject | Color
  // TODO: tests/storybook for below
  // `weight` does not have a type safe mapping to Grommet types.
  // This is due to Grommet's TShirtSizeType being a union with `string`.
  width?: WidthType
  // `height` does not have a type safe mapping to Grommet types.
  // This is due to Grommet's TShirtSizeType being a union with `string`.
  height?: HeightType
  fill?: BoxPropsGrommet['fill']
  pad?: BoxPropsGrommet['pad'] // TODO: This will be similar to gap... the same thoug?
}

const Box: React.FC<BoxProps> = (props) => {
  const { children, direction = 'row', ...forwardedProps } = props
  return (
    <BoxGrommet direction={direction} {...forwardedProps}>
      {children}
    </BoxGrommet>
  )
}

export type { BoxProps }
export { Box }
