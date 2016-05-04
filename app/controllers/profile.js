import Ember from 'ember';

export default Ember.Controller.extend({
  firebase: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  actions: {
    updateDisplayName(){
      let user = this.get('model');
      let sessionUser = this.get('session.currentUser');
      if(user.get('displayName')){
        this.set('session.currentUser.displayName', user.get('displayName'));
        user.save();
      }
    },

    updateCurrentPassword() {
      let user = this.get('model');
      const firebase = this.get('firebase');
      const flashMessages = this.get('flashMessages');

      if(user.get('newpassword')) {
        firebase.changePassword({
          email: user.get('email'),
          oldPassword: user.get('password'),
          newPassword: user.get('newpassword')
        }).then((err) => {
          if(err) {
            alert("ERR", err);
            flashMessages.danger('There was a problem updating');
          }else {
            flashMessages.success('Your password has been updated');
            user.setProperties({
              password: '',
              newpassword: ''
            });
          }
        });
      }
    }
  }
});
