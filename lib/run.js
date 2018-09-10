const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {seriesRun} = require('./helpers');

function run(options) {
  const {config, port, host} = options;
  const configPath = path.resolve(process.cwd(), config);
  let webpackConfigs = require(configPath);

  if (!Array.isArray(webpackConfigs)) {
    webpackConfigs = [webpackConfigs];
  }

  const last = webpackConfigs.pop();

  seriesRun(webpackConfigs, (err) => {
    if (err) {
      return;
    }

    const compiler = webpack(last);
    const server = new WebpackDevServer(compiler, last.devServer || {});

    server.listen(port, host, () => {
      process.stdout.write(chalk.cyan(`Honeypack (with webpack@${webpack.version}) is running at http://${host}:${port}\n`));
    });
  });
}

module.exports = run;
