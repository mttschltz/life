import React from 'react'
import { Heading as HeadingGrommet } from 'grommet'
import { BoxProps } from '@component/layout/Box'

interface HeadingProps {
  level: 1 | 2 | 3 | 4
  margin?: BoxProps['margin']
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

const Heading: React.FC<HeadingProps> = (props) => {
  return <HeadingGrommet {...props} />
}

export { Heading }
