import React, { useEffect, useState } from 'react'
import { createWikiPostPath, parseWikiLeaf } from '../../utils/parseWikiLeaf'

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
            const { name: title, href: path, nav } = parseWikiLeaf(str)
            return {
              title,
              path: createWikiPostPath(path, nav),
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

  if (list.length === 0) return <></>

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
