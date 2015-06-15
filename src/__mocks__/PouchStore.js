'use strict';

var Debug = require('debug');
var debug = Debug('pouchflux:store');

class PouchStore {
  constructor(name, view, key, readyFunc) {
    debug('constructor', arguments);
    this.docs = {};
    this.db = null;
    this.name = null;
    if(name) {
      var args = {name, view, key, readyFunc};
      this.onChangeName(args);
    }
  }

  onChangeName(args) {
    var {name, view, key, readyFunc} = args;
    this.db = {};
    this.name = name;
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
    debug('put', doc);
    onUpdateAll([doc]);
  }

  onUpdateAll(docs) {
    debug('update', docs);
    if(Array.isArray(docs)){
      for(var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        debug('doc', doc);
        var key = doc[this.key];
        debug('key', key);
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
    debug('docs', this.docs);
    if(this.processDocs) {
      this.processDocs();
    }
    this.emitChange();
  }

  onRemove(doc) {
    debug('remove', doc);
    doc._deleted = true;
    onUpdateAll([doc]);
  }

  onSync(destination) {
    debug('sync', this.name, destination);
  }

  onCreateDb(name) {
    debug('createDB', name);
  }

  onDeleteDb(name) {
    debug('deleteDB', name);
  }
}

module.exports = PouchStore;
