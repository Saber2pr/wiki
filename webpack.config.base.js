const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')
const inlinejs = require('./inlinejs.json')
const config = require('./app.json')
const WebpackBar = require('webpackbar')

const { templateContent } = require('@saber2pr/webpack-configer')
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + '/'

const cdnhost = `//fastly.jsdelivr.net/gh/${config.userId}`

const createConfig = ops => {
  const options = ops || {}
  const isApp = options.isApp
  return {
    entry: {
      index: './src/index.tsx',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
      filename: '[name][hash].min.js',
      path: path.join(__dirname, 'build'),
      publicPath: process.env.NODE_ENV === 'production' ? `/build/` : '/',
    },
    module: {
      rules: [
        // 使用babel编译js、jsx、ts、tsx
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ['babel-loader'],
        },
        {
          test: /\.(woff|svg|eot|ttf|png)$/,
          use: ['url-loader'],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath },
            },
            'css-loader',
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath },
            },
            'css-loader',
            'less-loader',
          ],
        },
      ],
    },
    devServer: {
      static: './',
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateContent: templateContent(config.title, {
          injectHead: `
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
          <meta name="keywords" content="react,antd,typescript,javascript,css,html,前端学习,前端进阶,个人博客">
          <meta name="description" content="长期更新前端技术文章,分享前端技术经验">
          ${isApp ? '<link rel="manifest" href="./manifest.json" />' : ''}
          <script async src="/click-mask/click-mask.min.js"></script>
          <script async src="/test/tools/debug.min.js"></script>
          ${isApp ? '' : Object.keys(inlinejs).map(
            key =>
              `<script type="text/javascript" id="${key}">${inlinejs[key]}</script>`
          )}
          `,
          injectBody:
          isApp ? `<div id="root"></div>` : `<div id="root"></div><script>LOADING.init(` +
            `"Loading..."` +
            ', 1000);</script>',
        }),
      }),
      new webpack.BannerPlugin({
        banner: `${version()};`,
        raw: true,
        test: /\.js/,
      }),
      new MiniCssExtractPlugin({
        filename: '[name][hash].css',
        chunkFilename: 'style.[id][hash].css',
      }),
      new WebpackBar(),
    ],
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules|lib/,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 200000,
        maxSize: 250000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: '[name]',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
}

module.exports = {
  createConfig,
}
