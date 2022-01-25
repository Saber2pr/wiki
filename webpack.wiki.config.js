const config = require('./app.json')

const path = require('path')
const { createConfig } = require('./webpack.config.base')

const cdnhost = `//cdn.jsdelivr.net/gh/${config.userId}`

const webpackConfig = createConfig({ isApp: false })

webpackConfig.entry.index = './src/wiki.tsx'
webpackConfig.output.publicPath = `${cdnhost}/${config.repo}@master/release/`
webpackConfig.output.path = path.join(__dirname, 'release')

module.exports = webpackConfig
