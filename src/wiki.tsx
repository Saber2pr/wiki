import 'normalize.css'
import 'animate.css/source/flippers/flipInX.css'
import './style/animation.less'
import './style/shadow.less'
import './style/components.less'
import './app.less'
import 'nprogress/nprogress.css'

import React, { useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'

// /
import { NavLink } from '@saber2pr/react-router'

import { ErrorBoundary, SearchInput, Themer } from './components'
import { getCurrentLang, I18nSelect } from './components/i18n-select'
import { origin } from './config'
import { useBlogMenu, useEvent, useFullWindow } from './hooks'
import { i18n } from './i18n'
import { Blog } from './pages'
import { request } from './request'
import { checkIsMob, getHash, parseTree, queryRootFirstChildMemo, whenInDEV } from './utils'
import { createWikiPostPath, filterTreeByNav } from './utils/parseWikiLeaf'
import nProgress from 'nprogress'
import { BottomLinks } from './components/bottom-links'
import { getCurrentThemeType } from './theme'

nProgress.configure({
  showSpinner: false,
})

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
    onClick={() => {
      nProgress.start()
    }}
  />
)

export const App = ({ blogTree }: App) => {
  const firstBlog = queryRootFirstChildMemo(blogTree)
  const navFilteredTree = useMemo(
    () => (origin.isWiki ? filterTreeByNav(blogTree) : blogTree),
    [blogTree]
  )
  const expand = useBlogMenu(navFilteredTree)

  const title = useMemo(() => document.title, [])

  const setTitle = () => {
    const hash = getHash()

    if (hash === '/' && firstBlog?.path) {
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
                {firstBlog?.title?.split(':')[0] || window.__title || 'Home'}
              </AppNavLink>
            </li>
            {(window.__navlist || []).map(nav => (
              <li key={nav}>
                <AppNavLink
                  to={createWikiPostPath(window.__navFirst?.[nav] || '', nav)}
                  isActive={() => window.__nav === nav}
                >
                  {nav}
                </AppNavLink>
              </li>
            ))}
            <li className="nav-block" />
            <li>
              <SearchInput blog={navFilteredTree} />
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
          tree={navFilteredTree}
          showOp={{
            latest: false,
          }}
        />
      </main>
      <footer ref={footer_ref} className="footer">
        <BottomLinks />
      </footer>
      <div id="top-toast" className="top-toast" />
    </>
  )
}

declare global {
  interface Window {
    __wiki
    __blog
    __updateTime
    __title
    __basename
    __adsSlotHtml
    __backgroundImage
    __i18nConfig
    __expandAllMenu
    __buttomlinksUri
    __navlist?: string[]
    __navFirst?: Record<string, string>
    __nav?: string
  }
}

const createWiki = (repo: string) => {
  origin.repo = repo
  origin.isWiki = true
  const current = getCurrentLang()
  i18n.setLocal(current.lang || 'en')

  if (!checkIsMob()) {
    import('@saber2pr/ai-assistant').then(({ initAIAssistant }) => {
      initAIAssistant({
        locale: current?.lang === 'zh' ? 'zh-CN' : 'en-US',
        initialPosition: {
          x: window.innerWidth - 80,
          y: window.innerHeight - 180
        },
        theme() {
          return getCurrentThemeType()
        },
        async onBeforeChat(messages) {
          if (!window.__blog) return messages
          if (!window.__title) return messages
          return [
            {
              role: "system",
              content: `${i18n.format('aiPrompt')} : ${decodeURIComponent(window.__title)} \n${decodeURIComponent(window.__blog)}`
            },
            ...messages
          ]
        },
      })
    })
  }

  const host = location.host || ''
  const result = host.match(/^([\s\S]*?)\.github\.io$/)
  if (result && result[1]) {
    origin.userId = result[1]
  }

  request('wiki')
    .then(blogTree => {
      ReactDOM.render(
        <ErrorBoundary>
          <App blogTree={parseTree(blogTree)} />
        </ErrorBoundary>,
        document.getElementById('root')
      )
    })
    .catch(err => {
      console.log('request wiki fail', err)
    })
}

if (whenInDEV()) {
  createWiki('./')
} else {
  createWiki(location.pathname.replace(/\//g, ''))
}
