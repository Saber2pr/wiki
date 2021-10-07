/*
 * @Author: saber2pr
 * @Date: 2019-11-21 22:13:28
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-07 14:11:31
 */
const staticAssets = [
  /** CODE START **/"\\build\\index~493df0b3a3cac26903f92205cf5c.css","\\build\\index~493df0b3a3cac26903f92205cf5c.min.js","\\build\\style.1a3cac26903f92205cf5c.css","\\build\\vendor~index~493df0b3a3cac26903f92205cf5c.min.js"/** CODE END **/,
  '/',
  // icon
  '/static/icon/saber2pr-144x144.png',
  // image
  '/static/image/bg-mb.webp',
  '/static/image/bg-pc.webp',
  // style
  '/static/style/dark.css',
]

const cdnStaticAssets = staticAssets.filter(src => src !== '/').map(src => `https://cdn.jsdelivr.net/gh/saber2pr/saber2pr.github.io@master${src}`)

const StaticCacheKey = 'saber2pr-pwa-static'
const DynamicCacheKey = 'saber2pr-pwa-dynamic'

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open(StaticCacheKey).then(cache => cache.addAll(staticAssets.concat(cdnStaticAssets)))
  )
)

const filterUrl = url =>
  !(
    url.startsWith('https://saber2pr.top/blog/')
    || url.startsWith('https://saber2pr.top/static/')
    || cdnStaticAssets.includes(url)
  )

self.addEventListener('fetch', event => {
  const url = event.request.url
  // only https
  if (!url.startsWith('https:')) return
  // cache list
  if (filterUrl(url)) return
  // version control
  if (url.startsWith('https://saber2pr.top/static/data/version.json')) return

  if (staticAssets.find(path => path !== '/' && url.includes(path))) {
    event.respondWith(caches.match(event.request))
    return
  }

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
