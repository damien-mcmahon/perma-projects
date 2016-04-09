import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let user = this.get('session.currentUser');
    return this.store.query('project', {
      orderBy: 'userId',
      equalTo: user.id
    });
  },
  actions: {
    deleteProject(project) {

      if(confirm("Do you want to delete this project ?")){
        this.store.query('stat', {
          limitToLast: 1
        }).then((stats) => {
          //@TODO: extract this into a better pattern
          let stat = stats.get('firstObject');
          let projectCountries = stat.get('projectsByCountry');
          let deleteProjectCountry = project.get('country');

          if(projectCountries[deleteProjectCountry]){
            let currentCount = projectCountries[deleteProjectCountry];
            if(currentCount === 1) {
              projectCountries[deleteProjectCountry] = null;
            } else {
              projectCountries[deleteProjectCountry] = --currentCount;
            }
          }

          let currentProjectsCount = stat.get('totalProjects');

          stat.setProperties({
            totalProjects: --currentProjectsCount,
            projectsByCountry: projectCountries
          });

          stat.save();
          project.destroyRecord();
        });

      }
    }
  }
});
