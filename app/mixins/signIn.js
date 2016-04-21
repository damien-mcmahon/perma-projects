import Ember from 'ember';

export default Ember.Mixin.create({
  checkForUser(user) {
    return this.store.query('user', {
      orderBy: 'loginId',
      equalTo: user.uid
    })
  },
  saveNewUser(user, callback) {
    let newUser = this.store.createRecord('user');

    newUser.setProperties({
      displayName: user.currentUser.displayName,
      loginId: user.uid,
      profileImageUrl: user.currentUser.profileImageURL,
      email: user.currentUser.email || '',
      likes: [],
      role: 1
    });

    newUser.save().then(() => {
      callback();
    })
  },
  updateStatsWithNewUser() {
    this.store.query('stat', {
      limitToLast: 1
    }).then((stats) => {
      let stat = stats.get('firstObject');
      let currentUsersCount = stat.get('totalUsers');

      stat.setProperties({
        totalUsers: ++currentUsersCount
      });

      stat.save();
      this.transitionTo('projects.index');
    });
  },
  signInEmailAndPassword(signInUser){
    this.get('session').open('firebase', {
      provider: 'password',
      email: signInUser.get('email'),
      password: signInUser.get('password')
    }).then((user) => {
      let checkUserExists = this.checkForUser(user);

      checkUserExists.then((results) => {
        if(!results.get('length')) {
          this.saveNewUser(user, this.updateStatsWithNewUser.bind(this));
        } else {

          if(user.isTemporaryPassword) {
            this.transitionTo('profile');
          }

          this.transitionTo('projects.index');
        }
      });
    })
  },
  socialSignIn(provider) {
    this.get('session').open('firebase', {
      provider: provider
    }).then((user) => {
      let checkUserExists = this.checkForUser(user);

      checkUserExists.then((results) => {
        if(!results.get('length')) {
          this.saveNewUser(user, this.updateStatsWithNewUser.bind(this));
        } else {
          this.transitionTo('projects.index');
        }
      });
    });
  }
});
