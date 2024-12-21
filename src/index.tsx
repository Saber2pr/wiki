import 'normalize.css'
import 'animate.css/source/flippers/flipInX.css'
import './style/animation.less'
import './style/shadow.less'
import './style/components.less'

import React from 'react'
import ReactDOM from 'react-dom'

// /
import Pages from './app'
import { checkUpdate } from './components'
import { origin } from './config/origin'
import { i18n } from './i18n'
import { request } from './request'
import { PWAInstaller, welcome, whenInDEV } from './utils'

const { DATA_LOADED } = origin.constants

const App = React.lazy(async () => {
  welcome()
  const homeInfo = await request('home')
  const aboutInfo = await request('about')
  const blogTree = await request('blog')
  i18n.setLocal('zh')

  if (!localStorage.getItem(DATA_LOADED)) {
    // for cache backend
    // requestLongListTask(
    //   collect(blogTree),
    //   item => requestContent(item.path + '.md'),
    //   item => !item.children,
    //   5
    // ).then(() => localStorage.setItem(DATA_LOADED, 'true'))
    localStorage.setItem(DATA_LOADED, 'true')
  }

  return {
    default: () => <Pages blogTree={blogTree} />,
  }
})

ReactDOM.render(<App />, document.getElementById('root'))

window.addEventListener('load', async () => {
  if (whenInDEV()) {
    LOADING.destroy()
    return
  }

  if ('serviceWorker' in navigator) {
    await PWAInstaller()
    checkUpdate(null, true, true)
  }

  LOADING.destroy()
})
