const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const {seriesRun} = require('./helpers');

function build(options) {
  const {config, env} = options;
  const configPath = path.resolve(process.cwd(), config);
  let webpackConfigs = require(configPath);

  if (!Array.isArray(webpackConfigs)) {
    webpackConfigs = [webpackConfigs];
  }

  console.time('cost');  // eslint-disable-line no-console
  process.stdout.write(chalk.cyan(`Honeypack (with webpack@${webpack.version}, NODE_ENV=${env}) is building your app...\n`));

  return new Promise((resolve, reject) => {
    seriesRun(webpackConfigs, (err) => {
      if (err) {
        return reject(new Error(err));
      }

      process.stdout.write(chalk.cyan(`Honeypack build success!\n`));
      console.timeEnd('cost');  // eslint-disable-line no-console

      resolve();
    });
  });
}

module.exports = build;
