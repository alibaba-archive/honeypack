const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const {seriesRun} = require('./helpers');

function build(options) {
  const {config} = options;
  const configPath = path.resolve(process.cwd(), config);
  let webpackConfigs = require(configPath);

  if (!Array.isArray(webpackConfigs)) {
    webpackConfigs = [webpackConfigs];
  }

  console.time('cost');  // eslint-disable-line no-console
  process.stdout.write(chalk.cyan(`Honeypack (with webpack@${webpack.version}) is building your app...\n`));

  seriesRun(webpackConfigs, (err) => {
    if (err) {
      return;
    }

    process.stdout.write(chalk.cyan(`Honeypack build success!\n`));
    console.timeEnd('cost');  // eslint-disable-line no-console
  });
}

module.exports = build;
