import React, { FunctionComponent } from 'react'
import { Anchor as GrommetAnchor, AnchorExtendedProps as GrommetAnchorExtendedProps } from 'grommet'
import { Link as GatsbyLinkSource, GatsbyLinkProps as GatsbyLinkPropsSource } from 'gatsby'

interface GatsbyLinkProps {
  to: GatsbyLinkPropsSource<never>['to']
}

const GatsbyLink: FunctionComponent<GatsbyLinkProps> = (props) => {
  return <GrommetAnchor as={GatsbyLinkSource} {...props} />
}

interface LinkProps {
  href: GrommetAnchorExtendedProps['href']
}

const Link: FunctionComponent<LinkProps> = (props) => {
  return <GrommetAnchor {...props} />
}

export { GatsbyLink, Link }
