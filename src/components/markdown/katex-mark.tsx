import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import math from 'remark-math'
import comment from 'remark-remove-comments'
import 'katex/dist/katex.min.css'

import { CodeBlock } from '../codeblock'

export interface KatexMarkdownProps {}

export const KatexMarkdown: React.FC<KatexMarkdownProps> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm, comment, math]}
      rehypePlugins={[html, rehypeKatex]}
      components={{
        code: CodeBlock,
      }}
    >
      {String(children).trim()}
    </ReactMarkdown>
  )
}

export default KatexMarkdown
