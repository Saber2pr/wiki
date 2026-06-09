export const parseWikiLeaf = (title = '') => {
  const [name, href, nav = 'posts'] = title.split(':')
  return { name, href, nav }
}

export const createWikiPostPath = (href: string, nav = 'posts') =>
  `${window.__basename}/${nav}/${href}/`

export const getCurrentWikiNav = () => window.__nav || 'posts'

export const filterTreeByNav = <T extends { title: string; path?: string; children?: T[] }>(
  tree: T,
  nav = getCurrentWikiNav()
): T => {
  const isLeaf = (node: T) => !Array.isArray(node.children)

  const filterNode = (node: T, isRootChild = false): T | null => {
    if (!node) {
      return null
    }

    if (isLeaf(node)) {
      // Root-level md is always kept in the tree; nav only filters nested items.
      if (isRootChild) {
        return { ...node }
      }
      const { nav: leafNav } = parseWikiLeaf(node.title)
      if (leafNav !== nav) {
        return null
      }
      return { ...node }
    }

    const filteredChildren = (node.children || [])
      .map(child => filterNode(child, false))
      .filter((child): child is T => !!child?.path)

    if (filteredChildren.length === 0) {
      return null
    }

    return {
      ...node,
      children: filteredChildren,
    }
  }

  const filteredChildren = (tree.children || [])
    .map(child => filterNode(child, true))
    .filter((child): child is T => !!child?.path)

  return {
    ...tree,
    children: filteredChildren,
  }
}
