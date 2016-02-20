import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      lat: 51.45,
      lng: -0.1,
      zoom: 5,
      projects: [{
        lat: 52,
        lng: -1.43,
        title: 'My Test Project',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        startDate: '2016-04-01T09:00:00',
        endDate: '2016-04-02T:19:00:00',
        contactDetails: {
          email: 'test@example.com',
          phone: '07000000000'
        },
        tags: ['planting', ''],
        volunteersNeeded: true
      }, {
        lat: 51.90,
        lng: -0.43,
        title: 'My Test Project 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        startDate: '2016-05-01T09:00:00',
        endDate: '2016-05-02T:19:00:00',
        contactDetails: {
          email: 'test2@example.com',
          phone: '07000000000'
        },
        tags: ['planting', 'earthworks'],
        volunteersNeeded: true
      }]
    };
  },
  init() {
    this._super.apply(this,arguments);
  }
});
