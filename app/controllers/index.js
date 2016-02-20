import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 12;
const MAP_STYLES = [
  {label: 'Default', url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'},
  {label: 'Landscape', url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'},
  {label: 'Landscape', url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'}
]

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: [],
  mapStyles: MAP_STYLES,
  selectedStyle: MAP_STYLES[0],
  actions: {
    onSearch(searchQuery) {
      let mapBox = this.get('mapbox');
      mapBox.query(searchQuery).then((results) => {
        this.set('searchResults', results.features);
      });
    },

    selectAddress(addressCoords) {
      let [lng,lat] = addressCoords;
      this.set('model.lat', lat);
      this.set('model.lng', lng);
      this.set('model.zoom', SEARCH_QUERY_ZOOM_LEVEL);
    }
  }
});
