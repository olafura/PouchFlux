/* vim :set ts=2 sw=2 sts=2 et : */
var alt = require('../alt');
var merge = require('object-assign');
var PouchDB = require('pouchdb');

var PouchActions = require('../actions/PouchActions');

class PouchStore {
  constructor(name, view, key) {
    console.log('constructor', arguments);
    this.bindActions(PouchActions);
    this.docs = {};
    this.db = new PouchDB(name);
    var options = {
      since: 'now',
      live: true,
      include_docs: true
    };
    var watchChanges = function(result) {
      if(result && result.rows) {
        PouchAction.update(result.rows);
      }
      this.changes = this.db.changes(options).on('change', function(change) {
        var doc = changes.doc;
        if(doc) { 
          PouchAction.update([doc]);
        }
      }).on('complete', function(info) {
      }).on('error', function (err) {
      });
    }.bind(this);
    if(view) {
      this.db.query(view, {include_docs: true}).then(watchChanges);
      options.filter = '_view';
      options.view = view;
    } else {
      this.db.allDocs({include_docs: true}).then(watchChanges);
    }
    if(key) { 
      this.key = key;
    } else {
      this.key = '_id';
    }
  }

  put(doc) {
    console.log('put', doc);
    return this.db.put(doc);
  }

  update(docs) {
    console.log('update', docs);
    for(var i = 0; i < docs.length; i++) {
      var doc = docs[i];
      var key = doc[this.key];
      if(doc._delete && key in this.docs) {
        delete this.docs[key];
      }
      this.docs[key] = doc;
    }
  }

  remove(doc) {
    console.log('remove', doc);
    return this.db.remove(doc);
  }

  sync(destination) {
    console.log('sync', this.name, destination);
    PouchDB.sync(this.name, destination);
  }

  createDb(name) {
  }

  deleteDb(name) {
  }
}

module.exports = PouchStore;
