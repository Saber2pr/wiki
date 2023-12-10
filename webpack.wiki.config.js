const path = require('path')
const { createConfig } = require('./webpack.config.base')

const webpackConfig = createConfig({ isApp: false })

webpackConfig.entry.index = './src/wiki.tsx'
webpackConfig.output.publicPath = `//saber2pr.top/wiki/release/`
webpackConfig.output.path = path.join(__dirname, 'release')

module.exports = webpackConfig
