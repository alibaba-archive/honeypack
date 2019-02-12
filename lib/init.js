const util = require('util');
const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const prettier = require('prettier');
const chalk = require('chalk');
const {promiseChain, pascalCase, getPackageManager, errorHandler} = require('./helpers');
const {transform} = require('./code');
const {INTERNAL_MODULE, PACKAGE_JSON_ONLY, REQUIRE_WITH_CAMEL_CASE} = require('./consts');
const write = util.promisify(fs.writeFile);

const entry = require('../config/entry');
const output = require('../config/output');
const resolve = require('../config/resolve');
const iModule = require('../config/module');
const plugins = require('../config/plugins');
const optimization = require('../config/optimization');

class InitGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.webpackConfig = {
      deps: {},
      config: {},
      _skipAllQuestions: opts.default
    };
    this.configFile = path.resolve(process.cwd(), this.options.output);

    this.on('error', errorHandler);
  }

  prompting() {
    const {webpackConfig} = this;

    webpackConfig.config.context = `__dirname`;
    webpackConfig.config.mode = `process.env.NODE_ENV === 'production' ? 'production' : 'development'`;

    return promiseChain([
      entry.bind(this),
      output.bind(this),
      resolve.bind(this),
      iModule.bind(this),
      plugins.bind(this),
      optimization.bind(this)
    ], webpackConfig).then(data => {
      const {deps, config} = data;
      const fragments = Object.keys(deps)
        .filter(key => deps[key] !== PACKAGE_JSON_ONLY)
        .map(key => `const ${deps[key] === REQUIRE_WITH_CAMEL_CASE ? pascalCase(key) : key} = require('${key}');`);

      fragments.push(transform(config));

      return write(this.configFile, prettier.format(fragments.join('\n'), {
        parser: 'babel',
        singleQuote: true,
        bracketSpacing: false
      }));
    }).catch(errorHandler);
  }

  install() {
    const {deps} = this.webpackConfig;
    const depsToInstall = Object.keys(deps).filter(key => deps[key] !== INTERNAL_MODULE);

    return getPackageManager().then(installer => {
      process.stdout.write(chalk.cyan(`Honeypack is installing dependencies using ${installer}...\n`));
      this.scheduleInstallTask(installer, depsToInstall, {'save-dev': true}, {cwd: path.dirname(this.configFile)});
    });
  }
}

function init(options) {
  const env = yeoman.createEnv();
  const rc = path.resolve(process.cwd(), '.yo-rc.json');
  const opts = Object.assign({}, options, {
    forceInstall: true  // Fail on install dependencies error
  });

  return write(rc, '{}').then(() => {
    env.registerStub(InitGenerator, 'honeypack:init');
    return env.run('honeypack:init', opts, () => {
      process.stdout.write(chalk.cyan(`Honeypack: Congratulations! Your webpack configuration file (${path.resolve(process.cwd(), options.output)}) has been created!\n`));
    });
  });
}

module.exports = init;
