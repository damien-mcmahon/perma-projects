import Ember from 'ember';

const DEFAULTS = {
  LOCATION: {
    lat: 52,
    lng: -1.4
  },
  ZOOM: 5
};
export default Ember.Controller.extend({
  startLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  zoomLevel: DEFAULTS.ZOOM,
  actions: {

  }
});
