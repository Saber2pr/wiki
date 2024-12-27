const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')
const config = require('./app.json')
const WebpackBar = require('webpackbar')

const { templateContent } = require('@saber2pr/webpack-configer')
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + '/'

const createConfig = ops => {
  return {
    entry: {
      index: './src/index.tsx',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        'react/jsx-runtime': 'react/jsx-runtime.js',
      },
    },
    output: {
      filename: '[name][hash].min.js',
      path: path.join(__dirname, 'build'),
      publicPath: process.env.NODE_ENV === 'production' ? `/wiki/build/` : '/',
    },
    module: {
      rules: [
        // 使用babel编译js、jsx、ts、tsx
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ['babel-loader'],
        },
        {
          test: /\.(woff|woff2|svg|eot|ttf|png)$/,
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
          <meta name="keywords" content="量化交易,freqtrade,web3,react,antd,typescript,javascript,css,html,前端学习,前端进阶,个人博客">
          <meta name="description" content="长期更新前端技术文章,分享前端技术经验">
          <script async src="/click-mask/click-mask.min.js"></script>`,
          injectBody: `<div id="root"></div>`,
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
