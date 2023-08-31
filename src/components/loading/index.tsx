import { i18n } from '../../i18n'
import './style.less'

import React, { useEffect, useState } from 'react'

export interface Loading {
  type?: "block" | "unset" | "line"
}

export const Loading = ({ type = "unset" }: Loading) => {
  if (type !== "unset") {
    return (
      <div
        style={{
          position: "relative",
          height: type === "block" ? "60vh" : "50vh"
        }}
      >
        <Loading />
      </div>
    )
  }

  const [message, setMessage] = useState(<></>)

  useEffect(() => {
    const handle = setTimeout(() => {
      setMessage(
        <div className="Message">
          {i18n.format('loading')}
        </div>
      )
    }, 1000)

    return () => clearTimeout(handle)
  }, [])

  return (
    <div className="Loading">
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      <div className="Loading-Block" />
      {message}
    </div>
  )
}
