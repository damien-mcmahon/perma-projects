import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  createdAt: DS.attr('date'),
  userId: DS.attr('string'),
  userName: DS.attr('string'),
  locationIsPublic: DS.attr('boolean', {defaultValue: true}),
  url: DS.attr('string'),
  facebookUrl: DS.attr('string'),
  twitter: DS.attr('string'),
  lat: DS.attr('number'),
  lng: DS.attr('number'),
  userIsProjectOwner: DS.attr('boolean'),
  address_1: DS.attr('string'),
  address_2: DS.attr('string'),
  city: DS.attr('string'),
  county: DS.attr('string'),
  country: DS.attr('string'),
  postCode: DS.attr('string', { defaultValue: ''}),
  likes: DS.attr('number'),
  views: DS.attr('number'),
  location: Ember.computed('lat', 'lng', function() {
    return { lat: this.get('lat'), lng: this.get('lng')};
  }),
  slugTitle: DS.attr('string'),
  isWWOOFSite: DS.attr('boolean'),
  isOpenForVisitors: DS.attr('boolean'),
  doesSellProduce: DS.attr('boolean', {defaultValue: false}),
  runsEducationalCourses: DS.attr('boolean', {defaultValue: false}),
  lookingForVolunteers: DS.attr('boolean', {defaultValue: false}),
  clippedDescription: Ember.computed('description', function(){
    const CHARS_TO_SHOW = 140;
    return this.get('description').substr(0, CHARS_TO_SHOW) + '...';
  })
});
