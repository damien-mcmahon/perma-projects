import DS from 'ember-data';

export default DS.Model.extend({
  totalProjects: DS.attr('number'),
  totalUsers: DS.attr('number'),
  projectsByCountry: DS.attr()
});
