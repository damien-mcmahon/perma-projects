import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.authenticatedRoute('new');
  this.route('project',{ path: '/project/:projectId' });
  this.route('about');
  this.authenticatedRoute('projects');
});

export default Router;
