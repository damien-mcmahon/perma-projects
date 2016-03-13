import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('project', { path: '/project/:projectId' }, function() {
    this.route('edit');
  });
  this.route('about');
  this.authenticatedRoute('projects', {}, function() {
    this.route('new');
  });
});

export default Router;
