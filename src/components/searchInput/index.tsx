import './style.less'

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useIsMob } from '../../hooks'
import { i18n } from '../../i18n'
import { Icon } from '../../iconfont'
import { Blog } from '../../pages'
import { store } from '../../store'
import { checkIsMob, collect, debounce } from '../../utils'
import { handleKeyInput } from '../../utils/handleKeyInput'
import { HighLightHTML } from '../highLight-html'

type Item = {
  path: string
  title: string
  isBlank?: boolean
  searchMeta?: string
  href?: string
}

type Search = (value: string) => void

const useSearch = (blog: Blog['tree']): [Item[], Search, string] => {
  const list = collect(blog).filter(l => l.title && !l['children'])
  const [result, set] = useState<Item[]>([])
  const [query, setSearch] = useState('')

  useEffect(() => {
    if (query) {
      const acc: Item[] = []
      for (const item of list) {
        if (item.title) {
          const [name, href] = item.title.split(':')
          if (name.toLowerCase().includes(query.toLowerCase())) {
            acc.push({
              path: `${window.__basename}/posts/${href}/`,
              searchMeta: query,
              title: name,
            })
          }
        }
      }
      set(acc)
    } else {
      set([])
    }
  }, [query])

  return [result, setSearch, query]
}

const Input = React.forwardRef<
  { blur: Function },
  {
    search: Search
    onblur?: Function
    onfocus?: Function
  }
>(({ search, onblur, onfocus }, ref) => {
  const isMob = useIsMob()
  const styles = {
    open: { width: isMob ? '7rem' : '10rem' },
    close: { width: '0' },
  }
  const [style, update] = useState<React.CSSProperties>(styles.close)

  const inputRef = useRef<HTMLInputElement>()
  useImperativeHandle(
    ref,
    () => ({
      blur: () => inputRef.current.blur(),
    }),
    []
  )

  return (
    <>
      <span
        className="SearchInput-Icon"
        onClick={() => inputRef.current.focus()}
        title={i18n.format('searchNote')}
      >
        <Icon.Sousuo />
        <span className="SearchInput-Icon-Name">{i18n.format('search')}</span>
      </span>
      <input
        className="SearchInput-Input"
        type="search"
        ref={inputRef}
        list="blog"
        onInput={e => {
          const input: string = e.target['value']
          if (input.startsWith('encode=') || input.startsWith('decode=')) {
            store.dispatch('context', input)
            inputRef.current.value = ''
          } else {
            debounce(() => search(input))
          }
        }}
        style={style}
        onFocus={() => {
          onfocus && onfocus()
          update(styles.open)
        }}
        onBlur={() => {
          onblur && onblur()
          setTimeout(() => update(styles.close), 500)
        }}
        placeholder={i18n.format('inputKw')}
      />
    </>
  )
})

const renderResult = (result: Item[], enable: boolean, onSubmit: Function) => {
  const blanks: JSX.Element[] = []
  const items: JSX.Element[] = []
  for (const { title, path, isBlank, searchMeta } of result) {
    if (isBlank) {
      blanks.push(
        <li key={path}>
          <a href={path} target="_blank" title={path}>
            {title}
          </a>
        </li>
      )
    } else {
      items.push(
        <li key={path}>
          <div className="SearchInput-List-Name">{title}</div>
          <a href={path} title={path} className="SearchInput-List-AText">
            <HighLightHTML
              source={title}
              target={searchMeta}
              transform={str =>
                `<span class="SearchInput-List-Key">${str}</span>`
              }
            />
            ...
            <span className="SearchInput-List-Btn">
              {i18n.format('viewContent')}
            </span>
          </a>
        </li>
      )
    }
  }
  if (!enable) return <></>
  if (result.length === 0) return <div>No Results.</div>
  return (
    <>
      {blanks[0] && (
        <li>
          <span className="SearchInput-List-Head" />
          <div className="SearchInput-List-Name">
            {i18n.format('searchOnNet')}
          </div>
        </li>
      )}
      {blanks}
      {items}
      <li className="SearchInput-List-More">
        <a
          target="_blank"
          href="https://github.com/marketplace/actions/wiki-builder"
        >
          By WikiBuilder
        </a>
      </li>
    </>
  )
}

export interface SearchInput {
  blog: Blog['tree']
}

export const SearchInput = ({ blog }: SearchInput) => {
  const [result, search, query] = useSearch(blog)
  const [enable, set] = useState(false)
  const ref = useRef<HTMLInputElement>()
  const onSubmit = () => {
    set(false)
    ref.current.blur()
    if (!result[0]) return
    handleKeyInput(query)
  }

  const [isMob, setIsMob] = useState(false)
  useEffect(() => {
    setIsMob(checkIsMob())
  }, [])

  return (
    <span className="SearchInput">
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Input
          ref={ref}
          search={search}
          onblur={() => setTimeout(() => set(false), 500)}
          onfocus={() => set(true)}
        />
      </form>
      <ul className="SearchInput-List">
        {renderResult(
          result.slice(0, isMob ? 5 : 6),
          enable && !!query,
          onSubmit
        )}
      </ul>
    </span>
  )
}
