import './style.less'

import React from 'react'

import { Link } from '@saber2pr/react-router'

import { TextTree } from '../../utils'
import { i18n } from '../../i18n'

const NextLink = ({
  to: item,
  className,
  children: name
}: {
  to: TextTree
  className?: string
  children?: string
}) => {
  if (!item || item.children) return <li className={className} />
  return (
    <li className={className}>
      <dl>
        <dt>{name}</dt>
        <dd>
          <Link to={item.path}>{item.title}</Link>
        </dd>
      </dl>
    </li>
  )
}

export interface NextBefore {
  before?: TextTree
  next?: TextTree
}

export const NextBefore = ({ before, next }: NextBefore) => (
  <nav className="NextBefore">
    <ul>
      <NextLink className="NextBefore-Left" to={before}>
        {i18n.format('lastPage')}
      </NextLink>
      <NextLink className="NextBefore-Right" to={next}>
        {i18n.format('nextPage')}
      </NextLink>
    </ul>
  </nav>
)
