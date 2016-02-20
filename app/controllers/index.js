import Ember from 'ember';

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: [],
  actions: {
    onSearch(searchQuery) {
      let mapBox = this.get('mapbox');
      mapBox.query(searchQuery).then((results) => {
        console.log("RESULTS: ", results);
        this.set('searchResults', results.features);
      });
    }
  }
});
