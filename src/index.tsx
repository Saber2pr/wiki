import 'normalize.css'
import 'animate.css/source/flippers/flipInX.css'
import './style/animation.less'
import './style/shadow.less'
import './style/components.less'

import React from 'react'
import ReactDOM from 'react-dom'

// /
import Pages from './app'
import { origin } from './config/origin'
import { i18n } from './i18n'
import { request } from './request'
import { welcome, whenInDEV } from './utils'
import { ErrorBoundary, Loading } from './components'

const { DATA_LOADED } = origin.constants

const App = React.lazy(async () => {
  welcome()
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

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
)

window.addEventListener('load', async () => {
  if (whenInDEV()) {
    LOADING.destroy()
    return
  }

  LOADING.destroy()
})
