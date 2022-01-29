import './style.less'

import React, { useCallback, useEffect, useState } from 'react'

import { Icon } from '../../iconfont'
import { localStore } from '../../store'
import { getCurrentThemeType, selectTheme, testStyle } from '../../theme'
import { ThemeStyleType } from '../../theme/styles'
import { getQuery } from '../../utils/getQuery'

export interface Themer {}

const useThemeSelector = (): [JSX.Element, () => void] => {
  const [view, display] = useState<JSX.Element>(<Icon.DarkTheme />)
  let localThemeCache = localStore.getItem('theme') as ThemeStyleType

  const query = getQuery()
  const res = query.match(/theme=(light|dark)/)
  if (res && res[1]) {
    const theme = res[1]
    localThemeCache = theme as any
  }

  useEffect(() => {
    if (testStyle(localThemeCache)) {
      selectTheme(localThemeCache)
      if (localThemeCache === 'dark') display(<Icon.DarkTheme />)
      if (localThemeCache === 'light') display(<Icon.LightTheme />)
    } else {
      display(<Icon.LightTheme />)
    }
  }, [localThemeCache])

  const changeTheme = useCallback(() => {
    const type = getCurrentThemeType()
    if (type === 'dark') {
      selectTheme('light')
      display(<Icon.LightTheme />)
      localStore.setItem('theme', 'light')
    }
    if (type === 'light') {
      selectTheme('dark')
      display(<Icon.DarkTheme />)
      localStore.setItem('theme', 'dark')
    }
  }, [])

  return [view, changeTheme]
}

export const Themer = ({}: Themer) => {
  const [view, changeTheme] = useThemeSelector()
  return (
    <span className="Themer" onClick={changeTheme}>
      {view}
    </span>
  )
}
