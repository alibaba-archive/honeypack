'use strict';

class Control {
  constructor({
    dll = true,
    mergePlugin = 'uniq',
    mergeLoader = 'uniq'
  } = {}) {
    const strategies = ['uniq', 'concat', 'myown'];

    if (!strategies.includes(mergePlugin)) {
      mergePlugin = 'uniq';
    }
    if (!strategies.includes(mergeLoader)) {
      mergeLoader = 'uniq';
    }

    this.dll = dll;
    this.mergePlugin = mergePlugin;
    this.mergeLoader = mergeLoader;
  }
}

module.exports = Control;
