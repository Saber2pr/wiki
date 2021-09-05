const api = 'https://nest-api-blog-saber2pr.vercel.app/v1'

const apis = {
  development: {
    v: '/api/v',
    pv: `${api}/visit/pv`
  },
  production: {
    v: 'https://blog.saber2pr.top/api/v',
    pv: `${api}/visit/pv`
  },
}[process.env.NODE_ENV]

export const ApiUrls = {
  comments163: 'https://api.uomg.com/api/comments.163?format=text',
  musicService: 'https://api.zhuolin.wang/api.php',
  ...apis,
}
