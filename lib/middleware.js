'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const merge = require('../lib/merge');
const webpackDevConfig = require('../config/webpack.dev');
const dllConfigGen = require('../config/dllConfigGen.js');
const dllConfig = dllConfigGen({
  isMiddleware: true
});
const utils = require('../lib/utils');
const Control = require('../lib/control');

function start(appRoot, options) {
  const contextPath = path.join(appRoot, options.root);
  const configPath = path.join(contextPath, './webpack.config.js');
  const middlewareConfig = {
    context: contextPath,
    entry: {
      app: './index.jsx',
    },
    plugins: []
  };
  let webpackAppConfig = {};

  if (fs.existsSync(configPath)) {
    webpackAppConfig = require(configPath);
  }
  if (!options.nodll) {
    middlewareConfig.plugins.push(
      new webpack.DllReferencePlugin({
        context: contextPath,
        manifest: path.join(contextPath, '.build/manifest.json')
      })
    );
  }
  const {honeypackConfig} = webpackAppConfig;
  const {verbose} = honeypackConfig;
  const control = new Control(honeypackConfig);
  delete webpackAppConfig.honeypackConfig;
  const webpackFinalConfig = utils.unLoaders(utils.unPlugins(merge(webpackDevConfig, middlewareConfig, webpackAppConfig, control)));

  if (verbose) {
    utils.print(webpackFinalConfig);
  }

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

  if (options.nodll || fs.existsSync(path.join(appRoot, options.root, '.build/build.js'))) {
    middleware = start(appRoot, options);
  } else {
    webpack(dllConfig, (err) => {
      if (err) {
        throw err;
      }

      middleware = start(appRoot, options);
    });
  }

  return (req, res, next) => {
    if (!middleware) {
      return next();
    }

    return middleware(req, res, next);
  };
};
