export const getHash = () =>
  typeof location !== 'undefined'
    ? decodeURIComponent(location.hash).slice(1)
    : ''
