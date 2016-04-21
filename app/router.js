import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('project', { path: '/project/:slugTitle' }, function() {
    this.authenticatedRoute('edit');
  });
  this.route('about');
  this.authenticatedRoute('projects', {}, function() {
    this.route('new');
  });
  this.route('stats');
  this.authenticatedRoute('admin');
  this.route('sign-up');
  this.authenticatedRoute('profile');
  this.route('forgot-password');
});

export default Router;
