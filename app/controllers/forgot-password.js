import Ember from 'ember';

export default Ember.Controller.extend({
  firebase: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  actions: {
    sendResetLink() {
      let firebase = this.get('firebase');
      let model = this.get('model');
      let email = model.get('email');
      const flashMessages = this.get('flashMessages');

      if(email.length){
        firebase.resetPassword({
          email: email
        }, (error) => {
          if(error) {
            flashMessages.danger(error);
          } else {
            flashMessages.success('Password has been reset, check your email for details');
            this.transitionToRoute('login');
          }
        });
      }
    }
  }
});
