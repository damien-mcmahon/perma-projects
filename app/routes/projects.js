import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let user = this.get('session.currentUser');
    return this.store.query('project', {
      orderBy: 'userId',
      equalTo: user.id
    });
  }
});
