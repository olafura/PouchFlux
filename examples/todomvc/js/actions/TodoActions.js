var alt = require('../alt')
var PouchActions = require('../../../../src/actions/PouchActions');

class TodoActions extends PouchActions {
  constructor() {
    this.generateActions(
      'create',
      'updateText',
      'toggleComplete',
      'toggleCompleteAll',
      'destroy',
      'destroyCompleted'
    )
  }
}

module.exports = alt.createActions(TodoActions)
