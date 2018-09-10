function entry(config) {
  return this.prompt([{
    type: 'input',
    name: 'entry',
    message: 'Which module will be the first to enter the application?',
    default: 'index.jsx',
    when: !config._skipAllQuestions
  }]).then(ans => {
    config.config.entry = {
      app: `'./${ans.entry || 'index.jsx'}'`
    };

    return config;
  });
}

module.exports = entry;
