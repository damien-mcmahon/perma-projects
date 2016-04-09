import Ember from 'ember';

const PROJECT_LIST_ZOOM_LEVEL = 13;

export default Ember.Component.extend({
  visibleProjects: [],
  pageSize: 10,
  totalPages: 0,
  init() {
    this._super(...arguments);
    let projects = this.get('projects')
    let pageSize = this.get('pageSize');
    this.visibleProjects = projects.slice(0, pageSize - 1);
    this.set('totalPages', Math.ceil(projects.get('length') / pageSize));
    //paginate at some point
  },
  didReceiveAttrs(attrs) {
    this._super(...arguments);
    let newAttrs = attrs.newAttrs;
    let newProjects = newAttrs.projects.value;
    this.set('visibleProjects', newProjects.slice(0, this.get('pageSize')));
  },
  actions: {
    hoverAction(project) {
      this.get('on-hover')({
        latitude: project.get('lat'),
        longitude: project.get('lng')
      }, PROJECT_LIST_ZOOM_LEVEL);
    },

    filterProjects(text) {
      let projectsToShow;

      if(text.length) {
        let searchRegEx = new RegExp(text, 'gi');
        projectsToShow = this.get('projects').filter((project) => {
          return project.get('title').match(searchRegEx);
        });
      } else {
        projectsToShow =
          this.get('projects').slice(0, this.get('pageSize') - 1);
      }
      this.set('visibleProjects', projectsToShow);
    }
  }
});
