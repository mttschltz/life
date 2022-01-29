import { CheckboxSelected, Plan } from 'grommet-icons'
import { Color } from '@component/util/theme'
import React from 'react'

// https://icons.grommet.io
const ICONS_MAP = { plan: Plan, 'checkbox-selected': CheckboxSelected } as const

type IconName = keyof typeof ICONS_MAP

const ICON_NAMES: IconName[] = Object.keys(ICONS_MAP).sort((a, b) => a.localeCompare(b)) as Array<
  keyof typeof ICONS_MAP
>

interface IconProps {
  // Reference Grommet Icon property types directly where possible. In cases where this results in
  // no useful intellisense suggestions, instead reconstruct the property types in the simplest
  // way possible to allow those suggestions. This problem occurs when Grommet types are unioned
  // with `string`. Typescript then considers any string valid, it simplifies the type to just be
  // string, and then editors will offer no intellisense suggestions.
  //
  // When we want both intellisense suggestions and to allow any string, we can use techniques
  // described here to reconstruct Grommet types:
  // https://github.com/microsoft/TypeScript/issues/29729
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  color?: Color
  name: IconName
}

const Icon: React.FC<IconProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const MappedIcon = ICONS_MAP[props.name]
  const { color, size } = props
  return <MappedIcon color={color} size={size}></MappedIcon>
}

export { Icon, ICON_NAMES }
export type { IconName }
