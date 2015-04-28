"use strict";

var alt = require('../alt');

class PouchActions {
  constructor() {
    this.generateActions(
      'put',
      'updateAll',
      'remove',
      'sync',
      'createDb',
      'deleteDb'
    )
  }
}

module.exports = alt.createActions(PouchActions);
