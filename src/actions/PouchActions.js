/* vim :set ts=2 sw=2 sts=2 et : */
var alt = require('../alt');

class PouchActions {					
  constuctor() {
    this.generateActions(
      'createNew',
      'put',
      'remove',
      'update',
      'delete',
      'sync',
      'createDb',
      'deleteDb'
    )
  }
}

module.exports = alt.createActions(PouchActions);
