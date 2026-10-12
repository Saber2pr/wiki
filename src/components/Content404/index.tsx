import React, { useEffect } from 'react'
import { createWikiPostPath, parseWikiLeaf } from '../../utils/parseWikiLeaf'
import { Loading } from '../loading'

export interface Content404Item {
  title: string
  path: string
}

export interface Content404Props {
  list: Content404Item[]
}

export const is404 = window.__title === '404'

export const getContent404List = (): Content404Item[] => {
  if (!is404) return []

  const pathname = decodeURIComponent(window.location.pathname)
  const targetName = pathname
    .split('/')
    .filter(i => !!i)
    .pop()

  if (!targetName || !window.__wiki) return []

  return decodeURIComponent(window.__wiki)
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
}

export const Content404: React.FC<Content404Props> = ({ list }) => {
  useEffect(() => {
    if (list.length === 1 && list[0]) {
      location.href = list[0].path
    }
  }, [list])

  if (list.length === 1) return <Loading type="line" />

  if (list.length === 0) return null

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
