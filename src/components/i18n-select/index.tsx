import React from 'react'
import './style.less'
import { getArray } from '../../utils'

export interface I18nSelectProps {}

export const I18nSelect: React.FC<I18nSelectProps> = ({}) => {
  if (!window.__i18nConfig) return <></>
  const config: Array<{
    name: string
    key: string
  }> = window.__i18nConfig || [
    {
      name: 'English',
      key: '/',
    },
    {
      name: 'Chinese',
      key: '/zh',
    },
  ]

  const current = getArray(config)[0]

  return (
    <div className="rn-i18n-select">
      <div className="rn-i18n-select-name">{current?.name}</div>
      <ul className="rn-i18n-select-list">
        {getArray(config).map((item, i) => (
          <li
            className="rn-i18n-select-list-item"
            onClick={() => {
              if (i === 0) {
                window.location.reload()
              } else {
                window.location.href = item.key
              }
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
