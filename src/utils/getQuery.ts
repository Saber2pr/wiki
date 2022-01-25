export const getQuery = () =>
  typeof location !== 'undefined' ? location.search : ''
