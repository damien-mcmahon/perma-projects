import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  createdAt: DS.attr('date'),
  userId: DS.attr('string'),
  userName: DS.attr('string'),
  isPublic: DS.attr('boolean'),
  email: DS.attr('string'),
  facebookUrl: DS.attr('string'),
  twitter: DS.attr('string')
});
