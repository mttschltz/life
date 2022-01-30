import React from 'react'
import { Heading as HeadingGrommet } from 'grommet'
import { BoxProps } from '@component/layout/Box'

interface HeadingProps {
  level: 1 | 2 | 3 | 4
  margin?: BoxProps['margin']
}

const Heading: React.FC<HeadingProps> = (props) => {
  return <HeadingGrommet size="small" {...props} />
}

export { Heading }
