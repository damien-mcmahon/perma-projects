import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    setupStats(){
      this.store.query('project', {
        orderBy: 'id'
      }).then((results) => {
        let totalResults = results.get('length');
        let statsModel = this.get('model').get('firstObject');
        let countriesAdded = statsModel.get('projectsByCountry');


        if(countriesAdded) {
          countriesAdded = {};
        }

        if(totalResults) {
          countriesAdded = countriesAdded || {};
          results.map((project) => {
            let projectCountry = project.get('country');
            if(!countriesAdded[projectCountry]) {
              if(projectCountry){
                countriesAdded[projectCountry] = 1;
              }
            } else {
              if(projectCountry) {
                let currentCount = countriesAdded[projectCountry];
                countriesAdded[projectCountry] = ++currentCount;
              }
            }
          });

          let userCount = this.store.query('user', {
            orderBy: 'id'
          }).then((users) => {
            if(users.get('length')){
              let userCount = users.get('length');

              statsModel.setProperties({
                'projectsByCountry': countriesAdded,
                'totalProjects': totalResults,
                'totalUsers': userCount
              });

              statsModel.save();
            }
          })

        }
      });
    }
  }
});
