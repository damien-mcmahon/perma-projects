import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.get('session').fetch().catch((err)=>{
      console.log("ERR", err);
    })
  },
  model() {
    return this.store.query('project', {
      limitToLast: 50
    });
  },
  actions: {
    signIn(provider) {
      this.get('session').open('firebase', {
        provider: provider
      });
    },
    signOut() {
      this.get('session').close();
    }
  }
});
