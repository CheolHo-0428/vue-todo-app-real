const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')

require('@babel/polyfill')

module.exports = (env, opts) => {
  // 중복되는 옵션들...
  const config = {
    // 확장자 생략
    resolve: {
      extensions: ['.vue', '.js']
    },

    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },

    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },

    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin([
        {
          from: 'assets/',
          to: ''
        }
      ])
    ]
  }

  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false, // npm run dev가 실행되면 웹페이지로 바로 이동하는걸 막아준다.
        hot: true
      }
    })

    // 제품용
  } else {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
