import React, { useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'

import 'animate.css/source/flippers/flipInX.css'

import './style/animation.less'
import './style/shadow.less'
import './style/components.less'

// /

import { NavLink } from '@saber2pr/react-router'

import './app.less'
import { Blog } from './pages'
import { Themer, Uv, ErrorBoundary, Loading, SearchInput } from './components'

import {
  getHash,
  queryRootFirstChildMemo,
  welcome,
  parseTree,
  whenInDEV,
} from './utils'
import { useEvent, useBlogMenu, useFullWindow } from './hooks'
import { origin } from './config'
import { request } from './request'
import { i18n } from './i18n'
import { I18nSelect } from './components/i18n-select'

export interface App {
  blogTree: Blog['tree']
}

const AppNavLink = ({
  className = 'nav-a',
  activeClassName = 'nav-a-active',
  ...props
}: NavLink) => (
  <NavLink
    className={className}
    activeClassName={activeClassName}
    {...props}
    useBrowserLink={origin.isWiki}
  />
)

export const App = ({ blogTree }: App) => {
  const firstBlog = queryRootFirstChildMemo(blogTree)
  const expand = useBlogMenu(blogTree)

  const title = useMemo(() => document.title, [])

  const setTitle = () => {
    const hash = getHash()

    if (hash === '/') {
      location.hash = '#' + firstBlog.path
    }

    hash.startsWith(blogTree.path) && expand(hash)
    const docTitle = hash.split('/').pop().split('?')[0] || title

    document.title = docTitle
  }
  useEvent('hashchange', setTitle)
  useEffect(() => {
    if (origin.isWiki) {
      const pathname = window.location.pathname
      expand(pathname)
    } else {
      setTitle()
    }
  }, [])

  const [header_ref, main_ref, footer_ref, btn_ref, fullWinBtnAPI] =
    useFullWindow({
      enableClassName: 'FullWinBtn iconfont icon-fullwin-enable',
      disableClassName: 'FullWinBtn iconfont icon-fullwin-disable',
    })

  useEffect(() => {
    const pre = document.getElementById('root-pre')
    if (pre) {
      pre.remove()
    }
  }, [])

  return (
    <>
      <header ref={header_ref}>
        <nav className="nav">
          <ul className="nav-ul">
            <li>
              <AppNavLink to={window.__basename + '/'}>
                {firstBlog.title.split(':')[0]}
              </AppNavLink>
            </li>
            <li className="nav-block" />
            <li>
              <SearchInput blog={blogTree} />
            </li>
            {/* <li className="nav-last">
              <a href="https://github.com/Saber2pr">GitHub</a>
            </li> */}
            <li>
              <I18nSelect />
            </li>
            <li className="nav-tool">
              <Themer />
            </li>
          </ul>
        </nav>
      </header>
      <main ref={main_ref} className="main">
        {window.__backgroundImage && (
          <picture
            className="main-bg"
            style={{
              background: `url(${window.__backgroundImage})`,
            }}
          />
        )}
        <Blog
          ref={btn_ref}
          fullWinBtnAPI={fullWinBtnAPI}
          tree={blogTree}
          showOp={{
            latest: false,
          }}
        />
      </main>
      <footer ref={footer_ref} className="footer">
        <div>
          <span className="footer-info">
            Copyright © 2019 - {new Date().getFullYear()} Saber2pr
            <Uv />
          </span>
        </div>
      </footer>
    </>
  )
}

declare global {
  interface Window {
    __wiki
    __blog
    __title
    __basename
    __adsSlotHtml
    __backgroundImage
    __i18nConfig
    __expandAllMenu
  }
}

const Wiki = React.lazy(async () => {
  welcome()
  let blogTree = parseTree(await request('wiki'))
  return {
    default: () => <App blogTree={blogTree} />,
  }
})

const createWiki = (repo: string) => {
  origin.repo = repo
  origin.isWiki = true
  i18n.setLocal('en')
  const host = location.host || ''
  const result = host.match(/^([\s\S]*?)\.github\.io$/)
  if (result && result[1]) {
    origin.userId = result[1]
  }
  ReactDOM.render(
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <Wiki />
      </React.Suspense>
    </ErrorBoundary>,
    document.getElementById('root')
  )
}

if (whenInDEV()) {
  createWiki('./')
} else {
  createWiki(location.pathname.replace(/\//g, ''))
}
