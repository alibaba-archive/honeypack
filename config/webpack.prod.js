'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('../lib/merge');
const webpackCommonConfig = require('./webpack.common');

const webpackProdConfig = {
  output: {
    path: path.resolve('./.package')
  },
  plugins: [
    // define插件，可以做环境变量，代码切分等功能(这里需要拓展)
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    // 代码压缩插件
    new webpack.optimize.UglifyJsPlugin({sourceMap: true})
  ]
};

module.exports = webpackMerge(webpackCommonConfig, webpackProdConfig);
