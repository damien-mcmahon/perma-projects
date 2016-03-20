import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    signOut() {
      this.get('signOut')();
    }
  }
});
