import { Diagram as GrommetDiagram, DiagramExtendedProps as GrommetDiagramExtendedProps } from 'grommet'
import React from 'react'
import { Color } from '@component'
import { BaseProps, setTestId } from '@component/Base'

type GrommetConnection = GrommetDiagramExtendedProps['connections'][number]

/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
type Thickness = 'hair' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large'
/* eslint-enable @typescript-eslint/sort-type-union-intersection-members */

type Connection = Omit<GrommetConnection, 'color' | 'label' | 'offset' | 'thickness'> & {
  color: Color
  thickness: Thickness
}

// Grommet doesn't forward `id`
interface DiagramProps extends Omit<BaseProps, 'id'> {
  connections: Connection[]
}

const Diagram: React.FC<DiagramProps> = (props) => {
  const { testId, connections, ...forwardedProps } = props
  return <GrommetDiagram {...forwardedProps} connections={connections} {...setTestId('Text', testId)} />
}

export type { DiagramProps }
export { Diagram }
