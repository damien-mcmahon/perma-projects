import DS from 'ember-data';

export default DS.Model.extend({
  displayName: DS.attr('string'),
  loginId: DS.attr('string'),
  profileImageUrl: DS.attr('string'),
  likes: DS.attr(),
  role: DS.attr('number', {defaultValue: 1})
});
