import { useEffect } from 'react'

import { getArray } from '../utils/array'
import { getHash } from '../utils/getHash'
import { whenInDEV } from '../utils/whenInDEV'

const createTokenSelector = (index: number, lang: string, type: any) =>
  `span[data-${index}-${lang}-token='${type.targetString}-${type.line}-${type.character}']`

const selectToken = (index: number, lang: string, type: any) => {
  if (type && type.targetString) {
    return document.querySelector(createTokenSelector(index, lang, type))
  }
}

const defaultSrc = whenInDEV()
  ? '/static/data/typesdef.json'
  : 'https://cdn.jsdelivr.net/gh/saber2pr/saber2pr.github.io@master/static/data/typesdef.json'

export const useTwoSlash = (dataSrc = defaultSrc) => {
  const key = getHash()
  useEffect(() => {
    if (dataSrc) {
      fetch(dataSrc)
        .then(res => res.json())
        .then(res => {
          const props = res
          const blocks = getArray<any>(props?.[key])
          for (let index = 0; index < blocks.length; index++) {
            const types = getArray<any>(blocks[index])
            if (Array.isArray(types)) {
              types.forEach((type, i) => {
                const dom =
                  selectToken(index, 'tsx', type) ??
                  selectToken(index, 'ts', type) ??
                  selectToken(index, 'jsx', type) ??
                  selectToken(index, 'js', type)
                if (dom) {
                  dom.setAttribute(
                    'data-lsp',
                    `${type.text ?? ''}\n${type.docs ?? ''}`
                  )
                }
              })
            }
          }
        })
    }
  }, [dataSrc, key])
}
