module.exports = {
  config: {
    desc: ['-c, --config <path>', 'Path to the config file, defaults to webpack.config.js'],
    default: 'webpack.config.js'
  },
  host: {
    desc: ['-h, --host <host>', 'The host to listen on, defaults to localhost'],
    default: 'localhost'
  },
  port: {
    desc: ['-p, --port <port>', 'The port to listen on, defaults to 8000'],
    default: '8000'
  },
  output: {
    desc: ['-o, --output <name>', 'The config file name'],
    default: 'webpack.config.js'
  },
  default: {
    desc: ['--default', 'Skip questions, create the config file directly']
  }
};
