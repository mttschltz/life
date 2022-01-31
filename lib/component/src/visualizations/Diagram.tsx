import { Diagram as GrommetDiagram, DiagramExtendedProps as GrommetDiagramExtendedProps } from 'grommet'
import React from 'react'
import { Color } from '@component'

type GrommetConnection = GrommetDiagramExtendedProps['connections'][number]

/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
type Thickness = 'hair' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large'
/* eslint-enable @typescript-eslint/sort-type-union-intersection-members */

type Connection = Omit<GrommetConnection, 'color' | 'label' | 'offset' | 'thickness'> & {
  color: Color
  thickness: Thickness
}

interface DiagramProps {
  connections: Connection[]
}

const Diagram: React.FC<DiagramProps> = (props) => {
  return <GrommetDiagram connections={props.connections} />
}

export type { DiagramProps }
export { Diagram }
