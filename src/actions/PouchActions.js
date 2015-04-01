/* vim :set ts=2 sw=2 sts=2 et : */
var alt = require('../alt');

class PouchActions {					
  put(doc) {
    this.dispatch(doc);
  }

  update(docs) {
    this.dispatch(docs);
  }

  remove(doc) {
    this.dispatch(doc);
  }

  sync(destination) {
    this.dispatch(destination);
  }

  createDb(name) {
    this.dispatch(name);
  }

  deleteDb(name) {
    this.dispatch(name);
  }
}

module.exports = alt.createActions(PouchActions);
