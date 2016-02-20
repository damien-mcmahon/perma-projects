import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 12;

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: [],
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
