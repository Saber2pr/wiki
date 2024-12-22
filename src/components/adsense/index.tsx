import React, { useEffect } from 'react'

export interface AdsenseProps {}

export const Adsense: React.FC<AdsenseProps> = ({}) => {
  useEffect(() => {
    if (window) {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])
  if (!window.__adsSlotHtml) return
  return (
    <div
      style={{ width: '100%', height: 'auto' }}
      dangerouslySetInnerHTML={{
        __html: decodeURIComponent(window.__adsSlotHtml),
      }}
    ></div>
  )
}
