'use strict';

class PouchActions {
  constructor() {
    this.generateActions(
      'changeName',
      'put',
      'updateAll',
      'remove',
      'sync',
      'createDb',
      'deleteDb'
    );
  }
}

module.exports = PouchActions;
