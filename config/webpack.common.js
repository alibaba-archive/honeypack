'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackCommonConfig = {
  entry: {
    app: './index.jsx', //路径需要动态设置
    //vendors: ['jquery', 'react'],//有疑问，必须要安装npm包才能注入到vendor文件里
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      // css加载器,支持css,less,sass
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'less-loader']
        })
      },
      // 支持读取图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/'
          }
        }
      },
      // 支持icon
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      },
      // 支持babel
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['env', 'react'], //'env'--babel7中的es7语法编译插件
            plugins: ['transform-decorators-legacy', 'transform-class-properties', 'add-module-exports', 'transform-object-rest-spread'],
            filename: __filename //临时解决因为presets获取'env'，默认进了项目目录的问题。通过强制指定filename到honeypack目录来解决
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname.split('node_modules')[0], 'node_modules'),  // find loaders in projects node_modules
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), 'assets/node_modules')
    ]
  },
  plugins: [
    // css抽离插件，同时支持css,less,sass
    new ExtractTextPlugin('[name].css'),
    // js抽离逻辑
    new webpack.optimize.CommonsChunkPlugin({
      names: ['public', 'vendor'],
      minChunks: (module, count) => {
        // https://webpack.js.org/plugins/commons-chunk-plugin/#passing-the-minchunks-property-a-function
        // https://stackoverflow.com/questions/30329337/how-to-bundle-vendor-scripts-separately-and-require-them-as-needed-with-webpack
        if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    })
  ]
};

module.exports = webpackCommonConfig;
