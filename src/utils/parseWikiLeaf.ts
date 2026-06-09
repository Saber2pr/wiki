export const parseWikiLeaf = (title = '') => {
  const [name, href, nav = 'posts'] = title.split(':')
  return { name, href, nav }
}

export const createWikiPostPath = (href: string, nav = 'posts') =>
  `${window.__basename}/${nav}/${href}/`
