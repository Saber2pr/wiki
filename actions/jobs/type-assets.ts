import { join, resolve } from 'path'

import * as tp from '@saber2pr/ts-compiler'
import { twoslasher } from '@typescript/twoslash'

import { sys } from '../sys'

const rootPath = resolve(join(__dirname, '../../'))

const matchPattern = (pattern: RegExp, str: string) => {
  const scan = new RegExp(pattern.source, 'g')
  let next = scan.exec(str)
  const result: RegExpExecArray[] = []
  while (next) {
    result.push(next)
    next = scan.exec(str)
  }
  return result
}

export const twoslasheTypes = async () => {
  const files = await tp.walkFile(join(__dirname, '../../blog'), entry =>
    /\.md$/.test(entry.path)
  )
  // filter demo files
  const demoFiles = files
    .reduce((acc, file) => {
      const codes = matchPattern(
        /\`\`\`([\s\S]*?)\n([\s\S]*?)\n\`\`\`/g,
        file.content
      )
        .filter(item => ['tsx', 'jsx', 'js', 'ts'].includes(item[1].trim()))
        .map(item => item[2])
        .filter(_ => !!_)
      return acc.concat({
        ...file,
        codes,
      })
    }, [] as Array<tp.EntryResult & { codes: string[] }>)
    .filter(file => file.codes.length > 0)

  const map = demoFiles.reduce((acc, item, i) => {
    const path = item.path
      .replace(rootPath, '')
      .replace(/\\/g, '/')
      .replace(/\.md$/, '')
    console.log(
      `[TypeGen(${Math.round((i * 100) / demoFiles.length)}%)] ${path}`
    )
    const types = item.codes.map(code => {
      const res = twoslasher(code, 'tsx', {
        defaultOptions: {
          noErrors: true,
        },
      })
      return res.staticQuickInfos
    })

    return {
      ...acc,
      [path]: types,
    }
  }, {})

  const dest = resolve(__dirname, '../../static/data/typesdef.json')
  await sys.writeFile(dest, JSON.stringify(map))
}
