import Ember from 'ember';

const PROJECT_LIST_ZOOM_LEVEL = 13;

const TOGGLE_TO_ATTR_MAP = {
  'wwoof': 'isWWOOFSite',
  'educational': 'runsEducationalCourses',
  'produce': 'doesSellProduce',
  'visitors': 'isOpenForVisitors',
  'volunteers': 'lookingForVolunteers'
};

export default Ember.Component.extend({
  visibleProjects: [],
  pageSize: 10,
  totalPages: 0,
  wwoof: false,
  produce: false,
  educational: false,
  visitors: false,
  volunteers: false,
  showFilters: false,
  init() {
    this._super(...arguments);
    let projects = this.get('projects');
    let pageSize = this.get('pageSize');
    this.visibleProjects = projects.slice(0, pageSize - 1);
    this.set('totalPages', Math.ceil(projects.get('length') / pageSize));
    //paginate at some point
  },

  didReceiveAttrs(attrs) {
    this._super(...arguments);
    let newAttrs = attrs.newAttrs;
    let newProjects = newAttrs.projects.value;
    setTimeout(()=>{
      this.set('visibleProjects', newProjects.slice(0, this.get('pageSize')));
    }, 100);
  },

  actions: {
    hoverAction(project) {
      this.get('on-hover')({
        latitude: project.get('lat'),
        longitude: project.get('lng')
      }, PROJECT_LIST_ZOOM_LEVEL);
    },

    toggleFilters() {
      this.toggleProperty('showFilters');
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
    },
    filterType(type) {
      this.toggleProperty(type);
      if(this.get(type)){
        let filteredProjects = this.get('projects').filter((project) => {
          return project.get(TOGGLE_TO_ATTR_MAP[type]) === this.get(type);
        });
        this.set('visibleProjects', filteredProjects);
      } else {
        this.set('visibleProjects',
          this.get('projects').slice(0, this.get('pageSize') - 1)
        );
      }
    }
  }
});
