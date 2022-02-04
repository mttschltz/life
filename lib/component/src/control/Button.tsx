import React from 'react'
import { Button as ButtonGrommet } from 'grommet'
import type { ButtonProps as GrommetButtonProps } from 'grommet'
import { BaseProps, setTestId } from '@component/Base'

interface ButtonProps extends BaseProps {
  context?: 'primary'
  size?: GrommetButtonProps['size']
  href?: GrommetButtonProps['href']
  raisePosition?: boolean
  testId: string // Make required for control components
}

const Button: React.FC<ButtonProps> = (props) => {
  const { context, children, raisePosition, ...forwardedProps } = props
  let style: React.CSSProperties | undefined = undefined
  if (raisePosition) {
    style = {
      zIndex: 1,
    }
  }
  return (
    <ButtonGrommet
      {...forwardedProps}
      primary={context === 'primary'}
      label={children}
      style={style}
      {...setTestId('Button', props.testId)}
    />
  )
}

export { Button }
