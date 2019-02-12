const path = require('path');
const util = require('util');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const {seriesRun} = require('./helpers');

function middleware(options) {
  const {config, hot} = options;
  const configPath = path.resolve(process.cwd(), config);
  let webpackConfigs = require(configPath);

  if (!Array.isArray(webpackConfigs)) {
    webpackConfigs = [webpackConfigs];
  }

  setTimeout(() => {
    process.stdout.write(chalk.cyan(`Honeypack (with webpack@${webpack.version}) is compiling...\n`));
  }, 0);

  const last = webpackConfigs.pop();

  return util.promisify(seriesRun)(webpackConfigs)
    .then(() => {
      const compiler = webpack(last);

      return hot ? [
        webpackDevMiddleware(compiler, last.devServer || {}),
        webpackHotMiddleware(compiler)
      ] : webpackDevMiddleware(compiler, last.devServer || {});
    });
}

module.exports = middleware;
