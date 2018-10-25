const fs = require('fs');
const path = require('path');
const {commandGenerator, errorHandler} = require('./helpers');

function bootstrap(command, options, ...args) {
  const action = require(`./${command}`);
  const {config = ''} = options;
  const configPath = path.resolve(process.cwd(), config);

  function run() {
    try {
      return action(options, ...args);
    } catch (e) {
      errorHandler(e);
    }
  }

  if (command !== 'init' && !fs.existsSync(configPath)) {
    const init = require('./init');

    return init({output: config}).then(run);
  }

  return Promise.resolve().then(run);
}

module.exports = (program) => {
  const command = commandGenerator.bind(program);

  command('init', ['output', 'default'], bootstrap);
  command({command: 'run', alias: 'start'}, ['config', 'host', 'port'], bootstrap);
  command('build', ['config'], bootstrap);

  program.parse(process.argv);
};

module.exports.middleware = (options) => {
  const defaultOptions = {
    config: 'webpack.config.js',
    root: './assets'
  };
  const opts = Object.assign({}, defaultOptions, options);
  const middleware = bootstrap('middleware', {config: path.join(opts.root, opts.config)});

  return async (req, res, next) => {
    const fn = await middleware;

    fn(req, res, next);
  };
};
