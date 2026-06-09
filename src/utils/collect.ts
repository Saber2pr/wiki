import { TreeNode } from '@saber2pr/rc-tree'

import { whenInDEV } from './whenInDEV'

export interface TextTree extends TreeNode {
  path: string
  title: string
  [k: string]: any
}

export function collect(tree: TextTree, stack = [tree]) {
  const result: Array<TextTree> = []
  while (stack.length) {
    const node = stack.shift()
    if (!node) {
      continue
    }
    node === tree || result.push(node)
    if (node.children) {
      stack.push(...node.children.filter(Boolean))
    }
  }

  whenInDEV(() => {
    const chars = ['&', '.', '\\']
    result.forEach(({ path }) => {
      chars.forEach(ch => {
        if (path.includes(ch))
          setTimeout(() => {
            throw TypeError(`path type error: ${path}\ninclude '${ch}'`)
          })
      })
    })
  })

  return result
}
