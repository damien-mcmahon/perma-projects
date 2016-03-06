import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 12;
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
const TEST_SEARCH_RESULTS = {"type":"FeatureCollection","query":["102","purlewent","drive"],"features":[{"id":"address.17819718615148260","type":"Feature","text":"Purlewent Drive","place_name":"102 Purlewent Drive, Bath and North East Somerset, Bath and North East Somerset BA1 4BB, United Kingdom","relevance":0.99,"properties":{},"bbox":[-2.3895277999999998,51.39412999999998,-2.3829179999999996,51.39792029999999],"center":[-2.385522,51.396326],"geometry":{"type":"Point","coordinates":[-2.385522,51.396326],"interpolated":true},"address":"102","context":[{"id":"place.8727","text":"Bath and North East Somerset"},{"id":"postcode.13793044308137920","text":"BA1 4BB"},{"id":"region.2299996767900","text":"Bath and North East Somerset"},{"id":"country.7737652549148820","text":"United Kingdom","short_code":"gb"}]},{"id":"place.13299","type":"Feature","text":"Drexel Hill","place_name":"Drexel Hill, Pennsylvania, United States","relevance":0.3233333333333333,"properties":{},"bbox":[-75.3343610099513,39.932204992041,-75.2769839904561,39.9648850095481],"center":[-75.2921,39.9471],"geometry":{"type":"Point","coordinates":[-75.2921,39.9471]},"context":[{"id":"postcode.11134597090157810","text":"19026"},{"id":"region.10935335870218730","text":"Pennsylvania"},{"id":"country.5877825732302570","text":"United States","short_code":"us"}]},{"id":"place.13310","type":"Feature","text":"Dripping Springs","place_name":"Dripping Springs, Texas, United States","relevance":0.3233333333333333,"properties":{},"bbox":[-98.2592410052804,30.0768879919902,-97.9921939914251,30.377140008456],"center":[-98.0867,30.1902],"geometry":{"type":"Point","coordinates":[-98.0867,30.1902]},"context":[{"id":"postcode.15143614601242850","text":"78620"},{"id":"region.5362387430486520","text":"Texas"},{"id":"country.5877825732302570","text":"United States","short_code":"us"}]},{"id":"place.13282","type":"Feature","text":"Dresher","place_name":"Dresher, Pennsylvania, United States","relevance":0.3233333333333333,"properties":{},"bbox":[-75.1862590099044,40.12689699384,-75.1381799904415,40.1634860099715],"center":[-75.1668,40.1409],"geometry":{"type":"Point","coordinates":[-75.1668,40.1409]},"context":[{"id":"postcode.10007790383688100","text":"19025"},{"id":"region.10935335870218730","text":"Pennsylvania"},{"id":"country.5877825732302570","text":"United States","short_code":"us"}]},{"id":"place.13308","type":"Feature","text":"Driftwood","place_name":"Driftwood, Texas, United States","relevance":0.3233333333333333,"properties":{},"bbox":[-98.1005770096796,30.0463369900121,-97.9720959900147,30.1680780092708],"center":[-98.0308,30.123],"geometry":{"type":"Point","coordinates":[-98.0308,30.123]},"context":[{"id":"postcode.7267414415919960","text":"78619"},{"id":"region.5362387430486520","text":"Texas"},{"id":"country.5877825732302570","text":"United States","short_code":"us"}]}],"attribution":"NOTICE: © 2016 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained."}

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: TEST_SEARCH_RESULTS.features,
  mapStyles: MAP_STYLES,
  selectedStyle: MAP_STYLES[1],
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  isSearching: false,
  zoomLevel: DEFAULTS.ZOOM,
  actions: {
    onSearch(searchQuery) {
      let mapBox = this.get('mapbox');
      this.set('isSearching', true);
      mapBox.query(searchQuery).then((results) => {
        this.set('isSearching', false);
        this.set('searchResults', results.features);
      });
    },

    selectAddress(addressCoords) {
      let [lat,lng] = addressCoords;
      this.set('mapLocation.lat', lat);
      this.set('mapLocation.lng', lng);
      this.set('zoomLevel', SEARCH_QUERY_ZOOM_LEVEL);
    }
  }
});
