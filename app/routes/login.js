import Ember from 'ember';
import SignIn from '../mixins/signIn';

export default Ember.Route.extend(SignIn,{
  model() {
    return this.store.createRecord('user');
  },
  actions: {
    signIn(provider) {
      this.socialSignIn(provider);
    },
    signInEmailPassword(signInUser) {
      this.signInEmailAndPassword(signInUser);
    }
  }
});
