import Ember from 'ember';
import ToriiFirebaseAdapter from 'emberfire/torii-adapters/firebase';


export default ToriiFirebaseAdapter.extend({
  firebase: Ember.inject.service()
  // ,
  // store: Ember.inject.service(),
  // open(authorization){
  //   var userId = authorization.uid,
  //       store  = this.get('store');
  //   return store.query('user', {
  //     orderBy: 'loginId',
  //     equalTo: userId
  //   }).then((user) => {
  //     let theUser = user.get('firstObject');
  //     return {
  //       currentUser: theUser
  //     };
  //   });
  // }
});
