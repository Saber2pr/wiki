import React, { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import comment from 'remark-remove-comments'
import { CodeBlock } from '../codeblock'
import { Loading } from '../loading'

export interface MarkdownProps {}

function containsTwoDollarSigns(str) {
  const regex = /\$\$(.*\$\$)/ // 匹配至少有两个$$
  return regex.test(str)
}

const LazyComponent = React.lazy(() => import('./katex-mark'))

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const str = String(children)
  if (containsTwoDollarSigns(str)) {
    return (
      <Suspense fallback={<Loading />}>
        <LazyComponent>{String(children).trim()}</LazyComponent>
      </Suspense>
    )
  }
  return (
    <ReactMarkdown
      remarkPlugins={[gfm, comment]}
      rehypePlugins={[html]}
      components={{
        code: CodeBlock,
      }}
    >
      {String(children).trim()}
    </ReactMarkdown>
  )
}
