var alt = require('../alt');
var React = require('react');
var merge = require('object-assign')
var PouchStore = require('../../../../src/stores/PouchStore');
var PouchActions = require('../../../../src/actions/PouchActions');


var TodoActions = require('../actions/TodoActions')

var todoStore = alt.createStore(class TodoStore extends PouchStore {
  constructor() {
    super('todoStore');
    this.bindActions(TodoActions)

    //this.todos = {}
  }

  /*
  update(id, updates) {
    if(this.todos[id] && updates){
      this.todos[id] = merge(this.todos[id], updates)
      PouchActions.put(this.todos[id]);
    }
  }

  updateAll(updates) {
    for (var id in this.todos) {
      this.update(id, updates)
    }
  }
  */

  onCreate(text) {
    text = text.trim()
    if (text === '') {
      return false
    }
    // hand waving of course.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
    //this.todos[id] = {
    this.onPut({
      _id: id,
      complete: false,
      text: text
    });
  }

  onUpdateText(doc) {
    /*
    var { id, text } = x
    text = text ? text.trim() : ''
    if (text === '') {
      return false
    }
    */
    //this.update(id, { text })
    PouchActions.put(doc)
  }

  onToggleComplete(id) {
    var doc = this.docs[id]
    var complete = !doc.complete
    var newdoc = merge(doc, { complete })
    PouchActions.put(newdoc);
    //this.update(id, { complete })
  }

  onToggleCompleteAll() {
    var complete = !todoStore.areAllComplete()
    this.onUpdateAll({ complete })
  }

  onDestroy(id) {
    //delete this.todos[id]
  }

  onDestroyCompleted() {
    /*
    for (var id in this.todos) {
      if (this.todos[id].complete) {
        this.onDestroy(id)
      }
    }
    */
  }

  static areAllComplete() {
    var { docs } = this.getState()
    for (var id in docs) {
      if (!docs[id].complete) {
        return false
      }
    }
    return true
  }
})

module.exports = todoStore
