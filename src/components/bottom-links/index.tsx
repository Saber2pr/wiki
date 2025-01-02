import './style.less'

import React from 'react'

import { origin } from '../../config'
import { axios } from '../../request'
import { checkIsMob, getArray } from '../../utils'
import { useAsync } from '../../hooks'

export interface BottomLinksProps {}

type Link = {
  name: string
  href: string
}

type LinkData = {
  [category: string]: Link[]
}

const getLinkData = async () => {
  try {
    const res = await axios.get<LinkData>(
      `${window.__basename}/links.json?ts=${Date.now()}`
    )
    return res.data
  } catch (error) {
    return {}
  }
}

export const BottomLinks: React.FC<BottomLinksProps> = ({}) => {
  const data = useAsync(getLinkData, {} as LinkData)

  const categoryList = Object.keys(data || {})

  return (
    <div className="sitebottom-links">
      <div className="sitebottom-links_content">
        <div
          className="sitebottom-links-head"
          style={{
            width: checkIsMob()
              ? '100%'
              : categoryList.length > 0
              ? 'calc(100% / 3)'
              : '100%',
          }}
        >
          <span>
            Copyright © {new Date().getFullYear()} {origin.userId}
          </span>
        </div>
        <div className="sitebottom-block">
          <div className="container">
            {categoryList.map(category => {
              return (
                <div className="column">
                  <div className="sitebottom-block-title">{category}</div>
                  <ul className="sitebottom-block-list">
                    {getArray(data[category]).map(item => (
                      <li
                        className="sitebottom-block-list-item"
                        key={item.name}
                      >
                        <a
                          referrerPolicy="no-referrer"
                          href={item.href}
                          target="_blank"
                          className="sitebottom-block-list-item-link"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
