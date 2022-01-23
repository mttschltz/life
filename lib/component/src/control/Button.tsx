import React from 'react'
import { Button as ButtonGrommet } from 'grommet'
import type { ButtonProps as GrommetButtonProps } from 'grommet'

interface ButtonProps {
  context?: 'primary'
  size?: GrommetButtonProps['size']
}

const Button: React.FC<ButtonProps> = (props) => {
  const primary = props.context === 'primary'
  return <ButtonGrommet primary={primary} label={props.children} size={props.size} />
}

export { Button }
