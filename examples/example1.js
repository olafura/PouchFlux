var alt = require('../src/alt');
var PouchStore = require('../src/stores/PouchStore');
var PouchActions = require('../src/actions/PouchActions');

class ExampleStore extends PouchStore {
  constructor() {
    super('test1');
  }
}

var exampleStore = alt.createStore(ExampleStore);

PouchActions.put({test: 'test1'});
