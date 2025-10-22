import './style.less'

import React, { useEffect, useLayoutEffect, useRef } from 'react'

import { Tree } from '@saber2pr/rc-tree'
import { Link, NavLink, Route, Switch } from '@saber2pr/react-router'

import {
  AniBtn,
  ErrorBack,
  LazyCom,
  Loading,
  NextBefore,
  ScrollToTop,
  TwoSide,
} from '../../components'
import { Content404, is404 } from '../../components/Content404'
import { origin } from '../../config'
import {
  fullWinBtnAPI,
  useAniLayout,
  useAsideHidable,
  useIsMobile,
} from '../../hooks'
import { useTwoSlash } from '../../hooks/useTwoSlash'
import { i18n } from '../../i18n'
import { Icon } from '../../iconfont'
import { API, requestContent } from '../../request'
import { store } from '../../store'
import {
  collect,
  findNodeByPath,
  queryRootFirstChildMemo,
  TextTree,
  timeDeltaFromNow,
} from '../../utils'
import { getQuery } from '../../utils/getQuery'
import { NotFound } from '../not-found'
import { Markdown } from '../../components/markdown'
import { Adsense } from '../../components/adsense'
import nprogress from 'nprogress'
import { parseTitle } from '../../utils/parseTitle'

const getDataLink = (to: string) => {
  return decodeURIComponent(to.replace(/^\//, '').replace(/\/$/, ''))
}

const BLink = (props: Link) => {
  return (
    <NavLink
      isActive={(to, path) => {
        if (origin.isWiki) {
          if (to && path) {
            const pathname = getDataLink(path)
            const curPath = getDataLink(to)
            return pathname === curPath
          }
        } else {
          return to === path
        }
      }}
      activeClassName="Blog-A-Active"
      className="Blog-A"
      {...props}
      data-link={getDataLink(props.to)}
      useBrowserLink={origin.isWiki}
    />
  )
}

export interface Blog {
  tree: TextTree
  fullWinBtnAPI: fullWinBtnAPI
  showOp?: {
    latest?: boolean
    musicBox?: boolean
  }
}

const createOriginHref = (href: string) =>
  API.createBlobHref(origin.userId, origin.repo, href + '.md')

export const getParentPath = (path: string) => {
  if (path) {
    const names = path.split('/')
    names.pop()
    return names.join('/')
  }
}

export const Blog = React.forwardRef<HTMLElement, Blog>(
  (
    {
      tree,
      fullWinBtnAPI: { select, selectProps, re: isFullWin },
      showOp = { latest: true, musicBox: true },
    }: Blog,
    fullwinBtn_ref
  ) => {
    const firstBlog = queryRootFirstChildMemo(tree)
    const links = collect(tree)

    const isOpen = useRef(false)
    const aniBtnRef = useRef<{ close: Function }>()
    const [ref, open, close] = useAniLayout()
    const isMobile = useIsMobile(close, open)

    const getLastModified = (href: string): string =>
      findNodeByPath(href, tree)['LastModified']

    useLayoutEffect(() => {
      window.scroll(0, 0)
      ref.current.scrollTop = store.getState().blogScrollTop
      return () => {
        store.getState().blogScrollTop = ref.current.scrollTop
      }
    }, [])

    const jumpMenu = () => {
      if (origin.isWiki) {
        const anchor = document.querySelector(
          `[data-link="${getDataLink(window.location.pathname)}"]`
        )
        if (anchor && typeof anchor.scrollIntoView === 'function') {
          anchor.scrollIntoView({ block: 'center' })
        }
      }
    }

    const Routes = links.reduce((acc, { title, path: href, children }, i) => {
      if (!children) {
        acc.push(
          <Route
            key={href}
            path={href}
            component={() => (
              <>
                <h1 className="Blog-Main-Title">{title}</h1>
                <div className="Blog-Main-Content">
                  <LazyCom
                    fallback={<Loading type="line" />}
                    await={requestContent(href + '.md')}
                    errorBack={<ErrorBack />}
                  >
                    {content => {
                      useTwoSlash()
                      return <Markdown>{content}</Markdown>
                    }}
                  </LazyCom>
                  {isPlain || origin.isWiki || (
                    <div className="Blog-Main-Content-Edit">
                      <a
                        className="Blog-Main-Content-Edit-A"
                        href={createOriginHref(href)}
                      >
                        {i18n.format('editPage')}
                      </a>
                      {firstBlog?.path === href || (
                        <a
                          className="Blog-Main-Content-Edit-A"
                          target="_blank"
                          href={API.createNewHref(
                            origin.userId,
                            origin.repo,
                            getParentPath(href)
                          )}
                        >
                          {i18n.format('newPage')}
                        </a>
                      )}
                    </div>
                  )}
                  {showOp.latest && (
                    <p className="Blog-Main-Content-Date">
                      最近更新 {timeDeltaFromNow(getLastModified(href))}
                    </p>
                  )}
                  <NextBefore before={links[i - 1]} next={links[i + 1]} />
                </div>
              </>
            )}
          />
        )
      }
      return acc
    }, [] as JSX.Element[])

    const [main_ref, btn_ref, switchIsHide, isShow] = useAsideHidable(ref)

    const selectFullWin = () => {
      select()
      if (isFullWin.current) {
        switchIsHide(true)
      } else {
        switchIsHide(false)
      }
    }

    const search = getQuery()
    const isPlainBlog = search.includes('plain-blog')
    const isPlainMenuBlog = search.includes('plain-menu-blog')
    const isPlain = isPlainBlog || isPlainMenuBlog
    useEffect(() => {
      if (isPlainBlog) {
        if (!isFullWin.current) {
          selectFullWin()
        }
      }
      if (isPlainMenuBlog) {
        if (!isFullWin.current) {
          select()
        }
      }
    }, [search])

    return (
      <div className="Blog">
        <TwoSide>
          <main className="Blog-Main" ref={main_ref}>
            {origin.isWiki ? (
              <>
                <h1 className="Blog-Main-Title">{window.__title}</h1>
                <div className="Blog-Main-Content">
                  <Markdown>{decodeURIComponent(window.__blog)}</Markdown>
                  {window.__updateTime && (
                    <p className="Blog-Main-Content-Date">
                      {i18n.format('lastUpdate')}{' '}
                      {timeDeltaFromNow(window.__updateTime * 1000)}
                    </p>
                  )}
                  {is404 && <Content404 />}
                </div>
                {window.__adsSlotHtml && (
                  <div
                    className="Blog-Main-Content"
                    style={{
                      marginTop: 0,
                      marginBottom: '2rem',
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Adsense />
                  </div>
                )}
              </>
            ) : (
              <Switch>
                {[
                  ...Routes,
                  <Route
                    key="not-found"
                    path="*"
                    component={() => <NotFound />}
                  />,
                ]}
              </Switch>
            )}
          </main>
          <aside className="Blog-Aside" ref={ref}>
            <div
              ref={btn_ref}
              className="Blog-Aside-Btn"
              onClick={() => switchIsHide()}
            >
              {Icon.TreeBtn(isShow, '-90deg', '90deg', 'rotate')}
            </div>
            <section className="Blog-Aside-Content">
              <Tree
                expandAll={window.__expandAllMenu === 'on'}
                from={tree}
                selectBtn={Icon.TreeBtn}
                map={({ path: href, title, children }) => {
                  if (href === firstBlog.path) return <></>
                  if (origin.isWiki) {
                    const [name, href] = title.split(':')
                    if (children) return <span>{parseTitle(name)}</span>
                    return (
                      <BLink
                        to={`${window.__basename}/posts/${href}/`}
                        onClick={() => {
                          nprogress.start()
                          if (!isMobile()) return
                          isOpen.current = close(false)
                          aniBtnRef.current.close()
                        }}
                      >
                        {parseTitle(name)}
                      </BLink>
                    )
                  }
                  if (children) return <span>{title}</span>
                  return (
                    <BLink
                      to={href}
                      onClick={() => {
                        if (!isMobile()) return
                        isOpen.current = close(false)
                        aniBtnRef.current.close()
                      }}
                    >
                      {title}
                    </BLink>
                  )
                }}
              />
            </section>
          </aside>
        </TwoSide>
        <AniBtn
          ref={aniBtnRef}
          onClick={() => {
            isOpen.current = isOpen.current ? close() : open()
          }}
        />
        {isShow || <ScrollToTop />}
        {<i {...selectProps()} ref={fullwinBtn_ref} onClick={selectFullWin} />}
        <div
          ref={el => {
            if (el) {
              jumpMenu()
            }
          }}
        ></div>
      </div>
    )
  }
)
