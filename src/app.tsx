import './app.less'

import React, { useEffect, useMemo } from 'react'

import {
  createHashHistory,
  NavLink,
  Route,
  Router,
  Switch,
} from '@saber2pr/react-router'

import { pushIV } from './api/pushIV'
import { Bagua, HeaderMessage, PreImg, SearchInput, Themer } from './components'
import { origin, Routes as RS } from './config'
import { useBlogMenu, useEvent, useFullWindow, useIsMob } from './hooks'
import { useShowMusic } from './hooks/useShowMusic'
import { Icon } from './iconfont'
import { Blog, Datav, NotFound, PageV, SearchResult, Secret } from './pages'
import { getHash, queryRootFirstChildMemo } from './utils'
import { BottomLinks } from './components/bottom-links'

export interface App {
  blogTree: Blog['tree']
}

const AppNavLink = ({
  className = 'nav-a',
  activeClassName = 'nav-a-active',
  ...props
}: NavLink) => (
  <NavLink className={className} activeClassName={activeClassName} {...props} />
)

const HashHistory = createHashHistory({ init: false })

export const App = ({ blogTree }: App) => {
  const firstBlog = queryRootFirstChildMemo(blogTree)
  const expand = useBlogMenu(blogTree)

  const isMob = useIsMob()

  const title = useMemo(() => document.title, [])
  const setTitle = () => {
    const hash = getHash()
    hash.startsWith(blogTree.path) && expand(hash)
    const currentTitle = hash.split('/').pop().split('?')[0] || title
    if (currentTitle === origin.title) {
      document.title = `${currentTitle}`
    } else {
      document.title = `${currentTitle} - ${origin.title}`
    }
    pushIV({
      type: '页面访问',
      payload: currentTitle,
    })
  }
  useEvent('hashchange', setTitle)
  useEffect(setTitle, [])

  const [header_ref, main_ref, footer_ref, btn_ref, fullWinBtnAPI] =
    useFullWindow({
      enableClassName: 'FullWinBtn iconfont icon-fullwin-enable',
      disableClassName: 'FullWinBtn iconfont icon-fullwin-disable',
    })

  const showMusic = useShowMusic()

  return (
    <Router history={HashHistory}>
      <header ref={header_ref}>
        <nav className="nav">
          <ul className="nav-ul">
            <li>
              <AppNavLink className="nav-start" to="/">
                <span className="nav-start-name">{RS.home.name}</span>
              </AppNavLink>
            </li>
            <li>
              <AppNavLink
                to={firstBlog.path}
                isActive={(_, ctxPath) => ctxPath.startsWith(blogTree.path)}
              >
                {RS.blog.name}
              </AppNavLink>
            </li>
            <li className="nav-block">
              <HeaderMessage />
            </li>
            <li>
              <SearchInput blog={blogTree} />
            </li>
            <li className="nav-last">
              <a href="https://github.com/Saber2pr">GitHub</a>
            </li>
            <li className="nav-tool">
              <Themer />
            </li>
          </ul>
        </nav>
      </header>
      <main ref={main_ref} className="main">
        <picture className="main-bg" />
        {isMob || <Bagua />}
        <Switch>
          <Route
            path={RS.blog.href}
            component={() => (
              <Blog
                ref={btn_ref}
                fullWinBtnAPI={fullWinBtnAPI}
                tree={blogTree}
                showOp={{
                  latest: true,
                  musicBox: false,
                }}
              />
            )}
          />
          <Route
            path={RS.datav.href}
            component={() => <Datav data={blogTree} />}
          />
          <Route path={RS.notFound.href} component={() => <NotFound />} />
        </Switch>
      </main>
      <footer ref={footer_ref} className="footer">
        <BottomLinks />
      </footer>
    </Router>
  )
}

export default App
