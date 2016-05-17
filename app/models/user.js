import Ember from 'ember';
import DS from 'ember-data';

const ADMIN_ROLE = 99;

export default DS.Model.extend({
  displayName: DS.attr('string'),
  loginId: DS.attr('string'),
  profileImageUrl: DS.attr('string'),
  email: DS.attr('string'),
  likes: DS.attr(),
  role: DS.attr('number', {defaultValue: 1}),
  isAdmin: Ember.computed.equal('role', ADMIN_ROLE)
});
