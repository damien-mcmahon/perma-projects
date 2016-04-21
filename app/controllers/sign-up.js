import Ember from 'ember';
import EmberValidations from 'ember-validations';
import SignIn from '../mixins/signIn';

export default Ember.Controller.extend(EmberValidations, SignIn, {
  firebase: Ember.inject.service(),
  showSignUpForm: false,
  emailErrors: false,
  hasErrors: false,
  actions: {
    checkEmailExists() {
      let email = this.get('model.email');
      this.store.query('user', {
        orderBy: 'email',
        equalTo: email
      }).then((results) => {
        if(results.get('length')) {
          let errors = this.get('errors');
          errors.set('model.email', ["Email is already in Use"]);
          this.set('emailErrors', true);
        }
      })
    },

    toggleSignUpForm() {
      this.toggleProperty('showSignUpForm');
    },

    signUpUser() {
      let user = this.get('model');
      // if(user.get('password') === user.get('confirm')){
        this.validate().then(() => {
          //create a user
          let firebase = this.get('firebase');
          firebase.createUser({
            email: user.get('email'),
            password: user.get('password')
          }, (err, user) => {
            if(err) {
              this.setProperties({
                'errors.model.email': [err],
                'emailErrors': true
              });
              return;
            }

            this.signInEmailAndPassword(user);

          });
        }).catch((err) => {
          this.set('hasErrors', true);
        })
    }
  },
  validations: {
    'model.email': {presence: true},
    'model.password': {presence: true},
    'model.confirm': {presence: true},
    'model.displayName': {presence: true}
  },
});
