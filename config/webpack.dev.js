'use strict';

const merge = require('../lib/merge');
const webpackCommonConfig = require('./webpack.common');
const webpack = require('webpack');

const webpackDevConfig = {
  // 开发者工具
  // inline-source-map 调试的时候需要，为每个文件加一个sourcemap的DataUrl，ps：是打包前的每个文件
  devtool: 'cheap-eval-source-map',
  plugins: [
    // define插件，可以做环境变量，代码切分等功能(这里需要拓展)
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
  ]
};

module.exports = merge(webpackCommonConfig, webpackDevConfig);
