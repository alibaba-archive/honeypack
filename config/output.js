const {INTERNAL_MODULE} = require('../lib/consts');

function output(config) {
  return this.prompt([{
    type: 'input',
    name: 'output',
    message: 'Which folder will your generated bundles be in?',
    default: '.package',
    when: !config._skipAllQuestions
  }]).then(ans => {
    config.deps['path'] = INTERNAL_MODULE;
    config.config.output = {
      filename: `'[name].js'`,
      chunkFilename: `'[name].js'`,
      path: `path.resolve('${ans.output || '.package'}')`
    };

    return config;
  });
}

module.exports = output;
