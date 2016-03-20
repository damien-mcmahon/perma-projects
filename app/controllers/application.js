import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    signIn(provider) {
      this.get('session').open('firebase', {
        provider: provider
      });
    },
    signOut() {
      this.get('session').close();
      this.transitionToRoute('index');
    }
  }
});
