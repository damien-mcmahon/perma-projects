import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    signIn(provider) {
      this.get('session').open('firebase', {
        provider: provider
      }).then((user) => {
        let checkUserExists = this.store.query('user', {
          orderBy: 'loginId',
          equalTo: user.uid
        });

        checkUserExists.then((results) => {
          if(!results.get('length')) {
            let newUser = this.store.createRecord('user');

            newUser.setProperties({
              displayName: user.currentUser.displayName,
              loginId: user.uid,
              profileImageUrl: user.currentUser.profileImageURL,
              likes: [],
              role: 1
            });

            newUser.save().then(() => {
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
            });
          } else {
            this.transitionTo('projects.index');
          }
        });
      });
    }
  }
});
