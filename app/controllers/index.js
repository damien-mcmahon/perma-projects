import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 10;
const COUNTRY_LEVEL_ZOOM = 5;
const MAP_STYLES = [
  {label: 'Default', url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'},
  {label: 'Landscape', url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'},
  {label: 'Outdoors', url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'},
  {label: 'Terrain', url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'}
];
const DEFAULTS = {
  LOCATION: {
    lat: 52,
    lng: -1.4
  },
  ZOOM: 5
};

const PRIVACY_CIRCLE_RADIUS = 100;

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: [],
  mapStyles: MAP_STYLES,
  selectedStyle: MAP_STYLES[1],
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  isSearching: false,
  zoomLevel: DEFAULTS.ZOOM,
  privacyCircleRadius: PRIVACY_CIRCLE_RADIUS,
  actions: {
    onSearch(searchQuery) {
      let mapBox = this.get('mapbox');
      this.set('isSearching', true);
      mapBox.query(searchQuery).then((results) => {

        this.set('isSearching', false);
        this.set('searchResults', results.features);
      });
    },

    setLocation(coords) {
      this.setProperties({
        mapLocation: {
          lat: coords.latitude,
          lng: coords.longitude
        },
        zoomLevel: SEARCH_QUERY_ZOOM_LEVEL
      });
    },

    selectAddress(address) {
      let [lng,lat] = address.center;
      let zoomLevel = address.properties.short_code ?
        COUNTRY_LEVEL_ZOOM : SEARCH_QUERY_ZOOM_LEVEL;

      this.setProperties({
        mapLocation: {
          lat: lat,
          lng: lng
        },
        zoomLevel: zoomLevel
      });
    }
  }
});
