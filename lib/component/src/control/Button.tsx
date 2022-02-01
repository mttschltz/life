import React from 'react'
import { Button as ButtonGrommet } from 'grommet'
import type { ButtonProps as GrommetButtonProps } from 'grommet'

interface ButtonProps {
  context?: 'primary'
  size?: GrommetButtonProps['size']
  href?: GrommetButtonProps['href']
  raisePosition?: boolean
}

const Button: React.FC<ButtonProps> = (props) => {
  const { context, children, raisePosition, ...forwardedProps } = props
  let style: React.CSSProperties | undefined = undefined
  if (raisePosition) {
    style = {
      zIndex: 1,
    }
  }
  return <ButtonGrommet primary={context === 'primary'} label={children} style={style} {...forwardedProps} />
}

export { Button }
