const config = require('./app.json')

const webpackConfig = require('./webpack.config')
const path = require('path')

const cdnhost = `//cdn.jsdelivr.net/gh/${config.userId}`

webpackConfig.entry.index = './src/wiki.tsx'
webpackConfig.output.publicPath = `${cdnhost}/${config.repo}@master/release/`
webpackConfig.output.path = path.join(__dirname, 'release')

module.exports = webpackConfig
