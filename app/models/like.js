import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  projectLikes: DS.attr()
});
