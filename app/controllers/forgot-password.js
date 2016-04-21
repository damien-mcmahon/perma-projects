import Ember from 'ember';

export default Ember.Controller.extend({
  firebase: Ember.inject.service(),
  actions: {
    sendResetLink() {
      let firebase = this.get('firebase');
      let model = this.get('model');
      let email = model.get('email');

      if(email.length){
        firebase.resetPassword({
          email: email
        }, (error) => {
          alert("Check your email for reset information");
        })
      }
    }
  }
});
