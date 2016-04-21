import Ember from 'ember';
import ToriiFirebaseAdapter from 'emberfire/torii-adapters/firebase';


export default ToriiFirebaseAdapter.extend({
  firebase: Ember.inject.service(),
  open(authorization) {
    if(authorization.provider === 'password') {
      authorization.password.id = authorization.uid;
      return this.store.query('user', {
        orderBy: 'loginId',
        equalTo: authorization.uid
      }).then((users) => {
        if(users.get('length')){
          authorization.password.displayName =
          users.get('firstObject').get('displayName');

          return {
            currentUser: authorization[authorization.provider]
          };
        }
      });
    }
    return {
      currentUser: authorization[authorization.provider]
    };
  }
});
