import Ember from 'ember';

const DEFAULTS = {
  LOCATION: {
    lat: 52,
    lng: -1.4
  },
  ZOOM: 5,
  ADDRESS_ZOOM: 12
};
export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  zoomLevel: DEFAULTS.ZOOM,
  locationData: null,
  searchResults: null,
  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
  actions: {
    onSearch(searchQuery) {
      let mapBox = this.get('mapbox');
      mapBox.query(searchQuery).then((results) => {
        console.log("SearhQ: ", searchQuery, results);
        this.set('searchResults', results.features);
      });
    },
    selectAddress(addressCoords) {
      let [lat, lng] = addressCoords;

      this.set('locationData', {
        lat: lat,
        lng: lng
      });

      this.set('mapLocation', {
        lat: lat,
        lng: lng
      });

      this.set('zoomLevel', DEFAULTS.ADDRESS_ZOOM);
    }
  }
});
