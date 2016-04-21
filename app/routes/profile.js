import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let user = this.get('session.currentUser');
    return this.store.query('user', {
      orderBy: 'loginId',
      equalTo: user.id
    }).then((response) => {
      return response.get('firstObject');
    });
  },

  afterModel(model) {
    let user = this.get('session.currentUser');
    model.set('isTemporaryPassword', user.isTemporaryPassword);
  }
});
