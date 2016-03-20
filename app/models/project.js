import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  createdAt: DS.attr('date'),
  userId: DS.attr('string'),
  userName: DS.attr('string'),
  locationIsPublic: DS.attr('boolean',{defaultValue: true}),
  url: DS.attr('string'),
  facebookUrl: DS.attr('string'),
  twitter: DS.attr('string'),
  location: DS.attr(),
  userIsProjectOwner: DS.attr('boolean'),
  address_1: DS.attr('string'),
  address_2: DS.attr('string'),
  city: DS.attr('string'),
  county: DS.attr('string'),
  country: DS.attr('string'),
  postCode: DS.attr('string', { defaultValue: ''}),
  likes: DS.attr('number'),
  views: DS.attr('number')
});
