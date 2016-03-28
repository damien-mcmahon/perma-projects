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
const PROJECTS_TO_SEARCH_COUNT = 10;

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  searchResults: {projects: [], places: []},
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
        this.set('searchResults', {
          places: results.features,
          projects: this.get('searchResults.projects')
        });
      });

      let projectsFound = this.store.query('project', {
        orderBy: 'title',
        startAt: searchQuery.charAt(0),
        limitToFirst: PROJECTS_TO_SEARCH_COUNT
      })

      projectsFound.then((results) => {
        let content = results.get('content');
        if(content) {
          let actualResults = content.filter((result) => {
            let recordTitle = result.record.get('title').toLowerCase();
            let cleanedSearchQuery = searchQuery.toLowerCase();
            return recordTitle.indexOf(cleanedSearchQuery) >= 0;
          });

          let mappedResults = actualResults.map((res) => res.record);

          this.set('searchResults', {
            places: this.get('searchResults.places'),
            projects: mappedResults
          });
        }
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

    selectAddress(result, type) {

      let lat,lng,zoomLevel;

      if(type === 'places') {
        [lng,lat] = result.center;
        zoomLevel = result.properties.short_code ?
        COUNTRY_LEVEL_ZOOM : SEARCH_QUERY_ZOOM_LEVEL;
      } else {
        let loc = result.get('location');
        lat = loc.lat;
        lng = loc.lng;
        zoomLevel = SEARCH_QUERY_ZOOM_LEVEL;
      }

      this.setProperties({
        mapLocation: {
          lat: lat,
          lng: lng
        },
        zoomLevel: zoomLevel
      });
    },

    getProjectsForBounds(event) {
      let bounds = event.target.getBounds();
      let southWest = bounds.getSouthWest();
      let northEast = bounds.getNorthEast();

      this.store.query('project', {
        orderBy: 'lat',
        startAt: southWest.lat,
        endAt: northEast.lat,
      }).then((res) => {
          let onScreenLocations = res.filter((result) => {
            let resultLng = result.get('lng');
            let minLng = southWest.lng;
            let maxLng = northEast.lng;
            return (resultLng >= minLng && resultLng <= maxLng);
          });

          this.set('model', onScreenLocations);
      });
    }
  }
});
