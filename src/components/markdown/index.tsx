import React, { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import comment from 'remark-remove-comments'

import { CodeBlock } from '../codeblock'

export interface MarkdownProps {}

function hasTwoDollarSigns(str) {
  try {
    let count = 0
    for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === '$' && str[i + 1] === '$') {
        count++
        i++ // 跳过下一个 '$'，避免重复计数
      }
      if (count >= 2) {
        return true // 如果找到了至少两个 $$，直接返回 true
      }
    }
    return false // 否则返回 false
  } catch (error) {
    return false
  }
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
  if (hasTwoDollarSigns(str)) {
    return (
      <Suspense fallback={preview}>
        <LazyComponent>{String(children).trim()}</LazyComponent>
      </Suspense>
    )
  }
  return preview
}
