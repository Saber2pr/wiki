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
import { initAIAssistant } from '@saber2pr/ai-assistant'

import { ErrorBoundary, SearchInput, Themer } from './components'
import { getCurrentLang, I18nSelect } from './components/i18n-select'
import { origin } from './config'
import { useBlogMenu, useEvent, useFullWindow } from './hooks'
import { i18n } from './i18n'
import { Blog } from './pages'
import { request } from './request'
import { getHash, parseTree, queryRootFirstChildMemo, whenInDEV } from './utils'
import nProgress from 'nprogress'
import { BottomLinks } from './components/bottom-links'

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


// 默认执行初始化
initAIAssistant({
  locale: 'en-US'
  // welcomeMessage: '有什么可以帮忙的？',
  // suggestions: ['如何用 Typescript 实现 Helloworld？', '物联网是什么？'],
  // placeholder: '给 GPT 发送消息',
  // emptyMessage: '我是AI，可以回答你的问题，请在下方输入框输入你的需求～',
  // async onBeforeChat(messages) {
  //   const knowledgeContent = await fetch('http://localhost:5001/HTML超文本标记语言/移动端禁用双指放大.md').then(res => res.text())
  //   return [
  //     {
  //       role: "system",
  //       content: `你是我的博客助手，根据我博客内容回答：移动端禁用双指放大的方法：\n${knowledgeContent}`
  //     },
  //     ...messages
  //   ]
  // },
});

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
  }
}

const createWiki = (repo: string) => {
  origin.repo = repo
  origin.isWiki = true
  const current = getCurrentLang()
  i18n.setLocal(current.lang || 'en')

  initAIAssistant({
    locale: current?.lang === 'zh' ? 'zh-CN' : 'en-US'
  })

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
