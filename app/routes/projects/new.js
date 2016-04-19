import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.createRecord('project');
  },
  actions: {
    didTransition(){
      this.controller.set('searchResults', null);
    }
  }
});
