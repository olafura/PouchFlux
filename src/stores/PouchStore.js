'use strict';

var merge = require('object-assign');
var debug = require('react-debug');
var PouchDB = require('pouchdb');

var PouchActions = require('../actions/PouchActions');

window.localStorage.debug = '*';

class PouchStore {
  constructor(name, view, key, readyFunc) {
    debug(this, 'constructor', arguments);
    this.bindActions(PouchActions);
    this.docs = {};
    this.db = new PouchDB(name);
    this.name = name;
    debug(this, 'db', this.db);
    debug(this, 'name', this.name);
    var options = {
      since: 'now',
      live: true,
      include_docs: true
    };
    var watchChanges = function(result) {
      debug(this, 'result', result);
      if(result && result.rows) {
        var newrows = result.rows.map(function(row){return row.doc;});
        this.onUpdateAll(newrows);
      }
      this.changes = this.db.changes(options).on('change', function(change) {
        debug(this, 'changes change', change);
        var doc = change.doc;
        if(doc) {
          this.onUpdateAll([doc]);
        }
      }.bind(this)).on('complete', function(info) {
        debug(this, 'changes complete', info);
      }.bind(this)).on('error', function (err) {
        debug(this, 'changes error', err);
      }.bind(this));
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
    if(readyFunc) {
    	readyFunc();
    }
  }

  onPut(doc) {
    debug(this, 'put', doc);
    if(this.db) {
      this.db.put(doc).then(function(result) {
          debug(this, 'put result', result);
      }).catch(function(err) {
          debug(this, 'put error: ', err);
      });
    }
  }

  onUpdateAll(docs) {
    debug(this, 'update', docs);
    if(this.db) {
      if(Array.isArray(docs)){
        for(var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          debug(this, 'doc', doc);
          var key = doc[this.key];
          debug(this, 'key', key);
          if(doc._deleted && key in this.docs) {
            delete this.docs[key];
          } else {
            this.docs[key] = doc;
          }
        }
      } else {
        for(var key2 in this.docs) {
          this.docs[key2] = merge(this.docs[key2], docs);
        }
      }
      debug(this, 'docs', this.docs);
      this.emitChange();
    }
  }

  onRemove(doc) {
    if(this.db) {
      debug(this, 'remove', doc);
      this.db.remove(doc).then(function(result) {
          debug(this, 'remove result', result);
      }).catch(function(err) {
          debug(this, 'remove error: ', err);
      });
    }
  }

  onSync(destination) {
    debug(this, 'sync', this.name, destination);
    if(this.db) {
      PouchDB.sync(this.name, destination);
    }
  }

  onCreateDb(name) {
    debug(this, 'createDB', name);
  }

  onDeleteDb(name) {
    debug(this, 'deleteDB', name);
  }
}

module.exports = PouchStore;
