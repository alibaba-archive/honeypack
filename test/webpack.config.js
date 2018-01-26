var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackOpts = {
  entry: {
    app: './index.jsx',
    //vendors: ['jquery', 'react'],//有疑问，必须要安装npm包才能注入到vendor文件里
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.package')
  },
  // 开发者工具
  // cheap-eval-source-map 打开source
  // inline-source-map 调试的时候需要，为每个文件加一个sourcemap的DataUrl，ps：是打包前的每个文件
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      // css加载器,支持css,less,sass
      {
        test: /\.(css|less|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'less-loader']
        })
      },
      // 支持读取图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader?name=[name].[ext]&publicPath=/&outputPath=assets/img/',
        ]
      },
      // 支持icon
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=[name].[ext]&publicPath=/&outputPath=assets/font/'
        ]
      },
      // 支持babel
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      }
    ]
  },
  plugins: [
    // define插件，可以做环境变量，代码切分等功能(这里需要拓展)
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    // 把静态资源注入html的plugins
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'index.html'), filename: 'index.html'}),
    // 代码压缩插件
    new webpack.optimize.UglifyJsPlugin({sourceMap: this.devtool && (this.devtool.indexOf('sourcemap') >= 0 || this.devtool.indexOf('source-map') >= 0)}),
    // css抽离插件，同时支持css,less,sass
    new ExtractTextPlugin({options: {id: '[id]', filename: '[name].css'}}),
    // js抽离逻辑
    new webpack.optimize.CommonsChunkPlugin({names: ['public', 'vendor'], minChunks: 2})
  ]
};

module.exports = webpackOpts;
