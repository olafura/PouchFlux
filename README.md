# PouchFlux
Flux with PouchDB

## Simple example

Action
```js
var alt = require('../alt');
var PouchActions = require('pouchflux/lib/PouchActions');

class ExampleActions extends PouchActions {
}

module.exports = alt.createActions(ExampleActions)
```

Store
```js
var alt = require('../alt');
var PouchStore = require('pouchflux/lib/PouchStore');

var ExampleActions = require('../actions/ExampleActions');

var exampleStore = alt.createStore(class ExampleStore extends PouchStore {
  constructor() {
    super('exampleStore');
    this.bindActions(ExampleActions)
  }

});
module.exports = exampleStore;
```

You can choose to set the database name with the super function or later with
the `PouchActions.changeName({'name':'exampleStore'});`

A more detailed example is in the ported version of the TodoStore from Alt.
