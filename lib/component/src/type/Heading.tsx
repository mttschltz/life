import React from 'react'
import { Heading as HeadingGrommet } from 'grommet'
import { BoxProps } from '@component/layout/Box'
import { BaseProps, setTestId } from '@component/Base'

interface HeadingProps extends BaseProps {
  level: 1 | 2 | 3 | 4
  margin?: BoxProps['margin']
}

const Heading: React.FC<HeadingProps> = (props) => {
  const { testId, ...forwardedProps } = props
  return <HeadingGrommet {...forwardedProps} size="small" {...setTestId('Heading', testId)} />
}

export { Heading }
