import React from "react"
import ReactDOM from "react-dom"

import "normalize.css"

import "animate.css/source/flippers/flipInX.css"

import "./style/animation.less"
import "./style/shadow.less"

// /

import Pages from "./app"
import { Loading, ErrorBoundary } from "./components"
import { welcome } from "./utils"
import { request } from "./request"

const App = React.lazy(async () => {
  welcome()
  const homeInfo = await request("home")
  const aboutInfo = await request("about")
  const blogTree = await request("blog")
  return {
    default: () => (
      <Pages homeInfo={homeInfo} aboutInfo={aboutInfo} blogTree={blogTree} />
    )
  }
})

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById("root")
)
