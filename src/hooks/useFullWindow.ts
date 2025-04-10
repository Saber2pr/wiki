import { useRef } from 'react'
import { i18n } from '../i18n'
import { useEvent } from './useEvent'
import { showTopToast } from '../utils/showTopToast'

const isFullWinBtnEnabled_ref = { current: false }

export type fullWinBtnAPI = {
  select: VoidFunction
  re: {
    current: boolean
  }
  selectProps: () => {
    className: string
    title: string
  }
}

export const useFullWindow = ({
  enableClassName,
  disableClassName,
}: {
  enableClassName: string
  disableClassName: string
}): [
  React.MutableRefObject<HTMLDivElement>,
  React.MutableRefObject<HTMLDivElement>,
  React.MutableRefObject<HTMLDivElement>,
  React.MutableRefObject<HTMLElement>,
  fullWinBtnAPI
] => {
  const header_ref = useRef<HTMLDivElement>()
  const footer_ref = useRef<HTMLDivElement>()
  const main_ref = useRef<HTMLDivElement>()
  const btn_ref = useRef<HTMLElement>()

  const enable = () => {
    header_ref.current.style.display = 'none'
    footer_ref.current.style.display = 'none'
    main_ref.current.style.marginTop = '0'
    btn_ref.current.className = disableClassName
    btn_ref.current.title = '退出全屏'
  }

  const disable = () => {
    header_ref.current.style.display = 'block'
    footer_ref.current.style.display = 'block'
    main_ref.current.style.marginTop = '2rem'
    btn_ref.current.className = enableClassName
    btn_ref.current.title = '进入全屏'
  }

  const select = () => {
    if (isFullWinBtnEnabled_ref.current) {
      disable()
      isFullWinBtnEnabled_ref.current = false
    } else {
      enable()
      isFullWinBtnEnabled_ref.current = true
      showTopToast({
        text: i18n.format('top_toast_shotcut'),
        once: true,
      })
    }
  }

  const selectProps = () =>
    isFullWinBtnEnabled_ref.current
      ? {
          className: disableClassName,
          title: i18n.format('exitFull'),
        }
      : {
          className: enableClassName,
          title: i18n.format('entryFull'),
        }

  function adjustFontSize(key) {
    const domNode = main_ref.current
    const bodyStyle = domNode.style
    const currentSize = parseFloat(getComputedStyle(domNode).fontSize)

    if (key === '+' || key === '=') {
      bodyStyle.fontSize = currentSize + 1 + 'px'
    } else if (key === '-' || key === '_') {
      bodyStyle.fontSize = currentSize - 1 + 'px'
    }
  }

  useEvent('keydown', function (event) {
    // Check if the Command key (Meta key) is pressed
    if (event.ctrlKey) {
      // Check if "+" or "-" key is pressed
      if (
        event.key === '+' ||
        event.key === '-' ||
        event.key === '_' ||
        event.key === '='
      ) {
        event.preventDefault()
        adjustFontSize(event.key)
      }
    }
  })

  return [
    header_ref,
    main_ref,
    footer_ref,
    btn_ref,
    {
      select,
      selectProps,
      re: isFullWinBtnEnabled_ref,
    },
  ]
}
