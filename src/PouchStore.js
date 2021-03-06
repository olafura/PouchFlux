'use strict';

var merge = require('object-assign');
var Debug = require('debug');
var debug = Debug('pouchflux:store');
var PouchDB = require('pouchdb');
PouchDB.adapter('socket', require('socket-pouch/client'));

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
    this.db = new PouchDB(name, {ajax: {cache: true}});
    this.name = name;
    debug('db', this.db);
    debug('name', this.name);
    var options = {
      since: 'now',
      live: true,
      include_docs: true
    };
    var watchChanges = function(result) {
      debug('result', result);
      if(result && result.rows) {
        var newrows = result.rows.map(function(row){return row.doc;});
        this.onUpdateAll(newrows);
      }
      this.changes = this.db.changes(options).on('change', function(change) {
        debug('changes change', change);
        var doc = change.doc;
        if(doc) {
          this.onUpdateAll([doc]);
        }
      }.bind(this)).on('complete', function(info) {
        debug('changes complete', info);
      }.bind(this)).on('error', function (err) {
        debug('changes error', err);
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
    debug('put', doc);
    if(this.db) {
      this.db.put(doc).then(function(result) {
          debug('put result', result);
      }).catch(function(err) {
          debug('put error: ', err);
      });
    }
  }

  onUpdateAll(docs) {
    debug('update', docs);
    if(this.db) {
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
  }

  onRemove(doc) {
    if(this.db) {
      debug('remove', doc);
      this.db.remove(doc).then(function(result) {
          debug('remove result', result);
      }).catch(function(err) {
          debug('remove error: ', err);
      });
    }
  }

  onSync(args) {
    var {destination, options} = args;
    debug('sync', this.name, destination, options);
    if(this.db) {
      if(options) {
        PouchDB.sync(this.name, destination, options);
      } else {
        PouchDB.sync(this.name, destination);
      }
    }
  }

  onCreateDb(name) {
    debug('createDB', name);
  }

  onDeleteDb(name) {
    debug('deleteDB', name);
  }
}

module.exports = PouchStore;
