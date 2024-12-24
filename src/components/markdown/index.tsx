import React, { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import comment from 'remark-remove-comments'

import { CodeBlock } from '../codeblock'

export interface MarkdownProps {}

function containsTwoDollarSigns(str) {
  const regex = /\$\$(.*\$\$)/ // 匹配至少有两个$$
  return regex.test(str)
}

const LazyComponent = React.lazy(() => import('./katex-mark'))

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const preview = (
    <ReactMarkdown
      remarkPlugins={[gfm, comment]}
      rehypePlugins={[html]}
      components={{
        code: CodeBlock,
        table: props => {
          const { node, ...rest } = props
          return (
            <div className="blog_table_wrap">
              <table {...rest} />
            </div>
          )
        },
        img: props => {
          const { node, ...rest } = props
          return <img loading="lazy" {...rest} />
        },
      }}
    >
      {String(children).trim()}
    </ReactMarkdown>
  )

  const str = String(children)
  if (containsTwoDollarSigns(str)) {
    return (
      <Suspense fallback={preview}>
        <LazyComponent>{String(children).trim()}</LazyComponent>
      </Suspense>
    )
  }
  return preview
}
