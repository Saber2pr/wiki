import React, { useEffect, useState } from 'react'

export interface Content404Props {}

export const is404 = window.__title === '404'

export const Content404: React.FC<Content404Props> = ({}) => {
  const [list, setList] = useState<{ title: string; path: string }[]>([])

  useEffect(() => {
    if (is404) {
      const pathname = decodeURIComponent(window.location.pathname)
      const targetName = pathname
        .split('/')
        .filter(i => !!i)
        .pop()
      if (targetName && window.__wiki) {
        const list = decodeURIComponent(window.__wiki)
          .split('\n')
          .filter(item => item && item.includes(targetName))
          .map(item => {
            const str = item.trim()
            const [title, path] = str.split(':')
            return {
              title,
              path: `${window.__basename}/posts/${path}/`,
            }
          })
        if (list.length > 0) {
          if (list.length > 1) {
            // >=2
            setList(list)
          } else {
            // ==1
            if (list[0]) {
              location.href = list[0].path
            }
          }
        }
      }
    }
  }, [])

  return (
    <div className="Content404">
      <h3>The following are links similar to the content being accessed.</h3>
      <ul>
        {list.map(item => (
          <li>
            <a href={item.path}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
