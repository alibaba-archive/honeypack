const assert = require('power-assert');
const build = require('../lib/build');
const path = require('path');

describe('# build with honeypack', () => {
  it('build should return a promise.then', (done) => {
    build({
      config: path.join(__dirname, 'test-proj-0', 'webpack.config.js')
    })
      .then(done);
  });

  it('build should return a promise.catch', (done) => {
    build({
      config: path.join(__dirname, 'test-proj-1', 'webpack.config.js')
    })
      .then(() => {
        assert(!'should not be here');
      }).catch((err) => {
        assert(err);
        done();
      });
  });
});

after(() => {
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
