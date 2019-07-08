const build = require('../lib/build');
const path = require('path');

describe('# build with honeypack', () => {
  it('build callback should be fired', (done) => {
    build({
      config: path.join(__dirname, 'test-proj-0', 'webpack.config.js')
    }, done);
  });
});

after(() => {
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});