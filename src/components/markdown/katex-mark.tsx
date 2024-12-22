import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import html from 'rehype-raw'
import gfm from 'remark-gfm'
import math from 'remark-math'
import comment from 'remark-remove-comments'
import { Adsense } from '../adsense'

import { CodeBlock } from '../codeblock'

export interface KatexMarkdownProps {}

export const KatexMarkdown: React.FC<KatexMarkdownProps> = ({ children }) => {
  useEffect(() => {
    if (document.querySelector('#katex-css')) {
      return
    }
    // 动态加载 CSS 文件
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.id = 'katex-css'
    link.href = '/__$basename$__/release/katex.min.css' // 组件的 CSS 文件路径
    document.head.appendChild(link)
  }, [])

  const lines = String(children).split('\n')

  let midPara = ''

  if (lines.length > 10) {
    midPara = lines[Math.floor(lines.length / 2)]
  }

  return (
    <ReactMarkdown
      remarkPlugins={[gfm, comment, math]}
      rehypePlugins={[html, rehypeKatex]}
      components={{
        code: CodeBlock,
        table: props => (
          <div className="blog_table_wrap">
            <table {...props} />
          </div>
        ),
        p: props => {
          const metaStr = props?.children
          if (metaStr && midPara) {
            if (String(metaStr).trim() === midPara.trim()) {
              return (
                <>
                  <p {...props} />
                  {window.__adsSlotHtml && <Adsense />}
                </>
              )
            }
          }
          return <p {...props} />
        },
      }}
    >
      {String(children).trim()}
    </ReactMarkdown>
  )
}

export default KatexMarkdown
