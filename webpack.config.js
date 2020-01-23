const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
const webpack = require("webpack")

const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + "/"

module.exports = WebpackConfig({
  entry: {
    index: "./src/index.tsx"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "[name].min.js",
    path: path.join(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader"]
      },
      {
        test: /\.(woff|svg|eot|ttf|png)$/,
        use: ["url-loader"]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath }
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath }
          },
          "css-loader",
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: templateContent("saber2prの窝", {
        injectHead: '<link rel="manifest" href="./manifest.json" />',
        injectBody: '<div id="root"></div>'
      })
    }),
    new webpack.BannerPlugin({
      banner: `${version()};`,
      raw: true,
      test: /\.js/
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 100000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})
