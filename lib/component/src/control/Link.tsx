import React, { FunctionComponent } from 'react'
import { Anchor as GrommetAnchor, AnchorExtendedProps as GrommetAnchorExtendedProps } from 'grommet'
import { Link as GatsbyLinkSource, GatsbyLinkProps as GatsbyLinkPropsSource } from 'gatsby'
import { BaseProps, setTestId } from '@component/Base'

interface GatsbyLinkProps extends BaseProps {
  to: GatsbyLinkPropsSource<never>['to']
  testId: string // Make required for control components
}

const GatsbyLink: FunctionComponent<GatsbyLinkProps> = (props) => {
  const { testId, ...forwardedProps } = props
  return <GrommetAnchor {...forwardedProps} as={GatsbyLinkSource} {...setTestId('GatsbyLink', testId)} />
}

interface LinkProps extends BaseProps {
  href: GrommetAnchorExtendedProps['href']
}

const Link: FunctionComponent<LinkProps> = (props) => {
  const { testId, ...forwardedProps } = props
  return <GrommetAnchor {...forwardedProps} {...setTestId('Link', testId)} />
}

export { GatsbyLink, Link }
