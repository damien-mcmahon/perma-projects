import Ember from 'ember';

export default Ember.Controller.extend({
  showEmailSignIn: false,
  actions: {
    showSignIn(){
      this.toggleProperty('showEmailSignIn');
    }
  }
});
