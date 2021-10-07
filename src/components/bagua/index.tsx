import './style.less'

import React, { useRef, useState, useEffect } from 'react'

import { useEvent } from '../../hooks'
import { throttle, } from '../../utils'
import { randomColor } from '../../utils/random'

export interface Bagua { };

export const Bagua = ({ }: Bagua) => {
  const ref = useRef<HTMLDivElement>()
  const [follow, setFollow] = useState(false)

  useEffect(() => {
    const bagua = ref.current
    if (!bagua) return
    bagua.style.setProperty('--color2', randomColor())
  }, [])

  useEvent('mousemove', (event) => {
    const bagua = ref.current
    if (!bagua) return

    if (follow) {
      throttle(() => {
        const x = event.clientX
        const y = event.clientY
        const offset = 20
        bagua.style.top = `${y + offset}px`
        bagua.style.left = `${x + offset}px`
      }, 16)
    }
  }, [follow])
  return <div data-color="red" ref={ref} className="bagua" onClick={() => setFollow(!follow)} title="点击跟随">
    <div className="left">
      <div className="left-1">
        <div className="left-1-1"></div>
      </div>
    </div>
    <div className="right">
      <div className="right-1">
        <div className="right-1-1"></div>
      </div>
    </div>
  </div>
}