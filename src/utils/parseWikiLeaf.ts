export const parseWikiLeaf = (title = '') => {
  const [name, href, nav = 'posts'] = title.split(':')
  return { name, href, nav }
}

export const createWikiPostPath = (href: string, nav = 'posts') =>
  `${window.__basename}/${nav}/${href}/`

export const getCurrentWikiNav = () => window.__nav || 'posts'

export const filterTreeByNav = <T extends { title: string; children?: T[] }>(
  tree: T,
  nav = getCurrentWikiNav()
): T => {
  const filterNode = (node: T): T | null => {
    if (!node.children) {
      const { nav: leafNav } = parseWikiLeaf(node.title)
      if (leafNav !== nav) {
        return null
      }
      return { ...node }
    }

    const filteredChildren = node.children
      .map(child => filterNode(child))
      .filter((child): child is T => child !== null)

    if (filteredChildren.length === 0) {
      return null
    }

    return {
      ...node,
      children: filteredChildren.filter(child => child?.path),
    }
  }

  const filtered = filterNode(tree)
  if (filtered) {
    return filtered
  }

  return {
    ...tree,
    children: [],
  }
}
