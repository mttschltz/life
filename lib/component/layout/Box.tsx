import React from 'react'
import { Box as BoxGrommet } from 'grommet'
import type { BoxProps as BoxPropsGrommet } from 'grommet'
import type { EdgeSizeType } from 'grommet/utils'
import { Color } from '@component'

type BackgroundGrommet = Exclude<BoxPropsGrommet['background'], string | undefined>
type Background = {
  dark?: Color | boolean
  light?: Color
  color?: Color
  opacity?: BackgroundGrommet['opacity']
}

/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
type TshirtSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

type Height =
  | 'xxsmall'
  | 'xxlarge'
  | TshirtSize
  | '100%'
  | {
      // height omitted from here though it's in the Grommet type. It doesn't appear to have an effect, even when
      // used in the absense of max or min.
      max?: 'xxsmall' | 'xxlarge' | TshirtSize | '100%'
      min?: 'xxsmall' | 'xxlarge' | TshirtSize | '100%'
    }

type Width =
  | 'xxsmall'
  | 'xxlarge'
  | TshirtSize
  | '100%'
  | {
      width?: 'xxsmall' | 'xxlarge' | TshirtSize | '100%'
      max?: 'xxsmall' | 'xxlarge' | TshirtSize | '100%'
      min?: 'xxsmall' | 'xxlarge' | TshirtSize | '100%'
    }
/* eslint-enable @typescript-eslint/sort-type-union-intersection-members */

type EdgeSize = EdgeSizeType

type Edge =
  | EdgeSize
  | 'none'
  | {
      bottom?: EdgeSize
      end?: EdgeSize
      horizontal?: EdgeSize
      left?: EdgeSize
      right?: EdgeSize
      start?: EdgeSize
      top?: EdgeSize
      vertical?: EdgeSize
    }

interface BoxProps {
  // Reference Grommet Box property types directly where possible. In cases where this results in
  // no useful intellisense suggestions, instead reconstruct the property types in the simplest
  // way possible to allow those suggestions. This problem occurs when Grommet types are unioned
  // with `string`. Typescript then considers any string valid, it simplifies the type to just be
  // string, and then editors will offer no intellisense suggestions.
  //
  // When we want both intellisense suggestions and to allow any string, we can use techniques
  // described here to reconstruct Grommet types:
  // https://github.com/microsoft/TypeScript/issues/29729
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch'
  as?: BoxPropsGrommet['as']
  direction?: BoxPropsGrommet['direction']
  flex?: BoxPropsGrommet['flex']
  gap?: EdgeSize | 'none'
  justify?: BoxPropsGrommet['justify']
  background?: Background | Color
  height?: Height
  width?: Width
  fill?: Exclude<BoxPropsGrommet['fill'], boolean> | 'both'
  pad?: Edge
  margin?: Edge
}

const Box: React.FC<BoxProps> = (props) => {
  const { children, fill, direction = 'row', ...forwardedProps } = props

  return (
    <BoxGrommet fill={fill === 'both' ? true : fill} direction={direction} {...forwardedProps}>
      {children}
    </BoxGrommet>
  )
}

export type { BoxProps }
export { Box }
