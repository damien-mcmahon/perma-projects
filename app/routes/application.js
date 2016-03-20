import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    accessDenied() {
      this.transitionTo('index');
    },
    signOut() {
      this.get('session').close();
    }
  }
});
