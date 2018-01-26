'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const merge = require('../lib/merge');
const webpackDevConfig = require('../config/webpack.dev');
const dllConfigGen = require('../config/dllConfigGen.js');
const dllConfig = dllConfigGen(true);
const utils = require('../lib/utils');

function start(appRoot, options) {
  const configPath = path.join(appRoot, options.root, './webpack.config.js');
  const middlewareConfig = {
    entry: {
      app: path.join(appRoot, options.root, './index.jsx'),
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: path.join(appRoot, options.root),
        manifest: path.join(appRoot, options.root, '.build/manifest.json')
      })
    ]
  };
  let webpackAppConfig = {};

  if (fs.existsSync(configPath)) {
    webpackAppConfig = require(configPath);
  }

  const webpackFinalConfig = utils.unPlugins(merge(webpackDevConfig, middlewareConfig, webpackAppConfig));
  const compiler = webpack(webpackFinalConfig);

  return webpackDevMiddleware(compiler, webpackFinalConfig.devServer || {});
}

module.exports = (app, opts) => {
  const defaultOptions = {
    root: './assets'
  };
  const appRoot = app.config.root;
  const options = Object.assign({}, defaultOptions, opts);
  let middleware;

  if (!fs.existsSync(path.join(appRoot, options.root, '.build/build.js'))) {
    webpack(dllConfig, (err) => {
      if (err) {
        throw err;
      }

      middleware = start(appRoot, options);
    });
  } else {
    middleware = start(appRoot, options);
  }

  return (req, res, next) => {
    if (!middleware) {
      return next();
    }

    return middleware(req, res, next);
  };
};
