import React from 'react'
import ReactMarkdown from 'react-markdown'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import comment from 'remark-remove-comments'
import rehypeKatex from 'rehype-katex'
import math from 'remark-math'
import { CodeBlock } from '../codeblock'

export interface MarkdownProps {}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
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
