/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-07 18:09:02
 */
const staticAssets = [
  /** CODE START **/"/build/index~493df0b396d1205bb98501366a34.css","/build/index~493df0b396d1205bb98501366a34.min.js","/build/style.196d1205bb98501366a34.css","/build/vendor~index~493df0b396d1205bb98501366a34.min.js"/** CODE END **/,
  '/',
  // icon
  '/static/icon/saber2pr-144x144.png',
  // image
  '/static/image/bg-mb.webp',
  '/static/image/bg-pc.webp',
  // style
  '/static/style/dark.css',
]

const StaticCacheKey = 'saber2pr-pwa-static'
const DynamicCacheKey = 'saber2pr-pwa-dynamic'

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open(StaticCacheKey).then(cache => cache.addAll(staticAssets))
  )
)

const filterUrl = url => !(url.startsWith('https://saber2pr.top/blog/') || url.startsWith('https://saber2pr.top/static/'))

self.addEventListener('fetch', event => {
  const url = event.request.url
  // match statics
  const staticTarget = staticAssets.find(path => path !== '/' && url.includes(path))
  if (staticTarget) {
    return event.respondWith(caches.match(staticTarget))
  }

  // only https
  if (!url.startsWith('https:')) return

  // version control
  if (url.startsWith('https://saber2pr.top/static/data/version.json')) return

  // cache list
  if (filterUrl(url)) return

  event.respondWith(
    caches.match(event.request).then(resFromCache => {
      if (resFromCache) return resFromCache
      const reqToCache = event.request.clone()

      return fetch(reqToCache).then(resFromNet => {
        if (
          filterUrl(reqToCache.url) ||
          (resFromNet && resFromNet.status !== 200)
        ) {
          return resFromNet
        }

        const resToCache = resFromNet.clone()
        caches
          .open(DynamicCacheKey)
          .then(cache => cache.put(event.request, resToCache))

        return resFromNet
      })
    })
  )
})

self.addEventListener('activate', event => event.waitUntil(clients.claim()))
