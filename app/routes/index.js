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
  }
});
