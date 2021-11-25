/* eslint-disable @typescript-eslint/ban-types */
import { Node, NodePluginArgs } from 'gatsby'
import { FileSystemNode } from 'gatsby-source-filesystem'

type SharpMethod = 'fixed' | 'fluid' | 'resize'

export interface RemarkNode {
  [key: string]: unknown
  type: string
}

export interface Args extends NodePluginArgs {
  markdownAst: RemarkNode
  markdownNode: Node
  files: FileSystemNode[]
}

export interface SharpResult {
  aspectRatio: number
  src: string
  srcSet?: string
  srcWebp?: string
  srcSetWebp?: string
  base64?: string
  tracedSvg?: string

  // fixed, resize
  width?: number
  height?: number

  // fluid
  presentationHeight?: number
  presentationWidth?: number
  sizes?: string
  originalImg?: string
}

export interface CreateMarkupArgs extends SharpResult {
  sharpMethod: SharpMethod
  originSrc: string
  title?: string
  alt?: string
}

export interface MarkupOptions {
  loading: 'auto' | 'eager' | 'lazy'
  linkImagesToOriginal: boolean
  showCaptions: boolean
  wrapperStyle: Function | string
  backgroundColor: string
  tracedSvg: Object | boolean
  blurUp: boolean
}

export type CreateMarkup = (args: CreateMarkupArgs, options?: MarkupOptions) => string

export interface Options extends Partial<MarkupOptions> {
  [key: string]: unknown
  plugins: unknown[]
  staticDir?: string
  createMarkup?: CreateMarkup
  sharpMethod: SharpMethod
}
/* eslint-enable @typescript-eslint/ban-types */
