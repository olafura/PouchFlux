/* vim :set ts=2 sw=2 sts=2 et : */
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
