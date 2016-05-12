import Ember from 'ember';
import Mapping from '../mixins/mapping';

const PROJECTS_TO_SEARCH_COUNT = 10;
const LOCATION_UPDATE_DELAY = 250;

export default Ember.Controller.extend(Mapping, {
  mapbox: Ember.inject.service(),
  searchResults: {projects: [], places: []},
  showProjectList: true,
  isSearching: false,
  actions: {
    toggleProjectList() {
      this.toggleProperty('showProjectList');
    },
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
      });

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

    setLocation(coords, zoomLevel = this.SEARCH_QUERY_ZOOM_LEVEL) {
      setTimeout(() =>{
        this.setProperties({
          mapLocation: {
            lat: coords.latitude,
            lng: coords.longitude
          },
          zoomLevel: zoomLevel
        });
      }, LOCATION_UPDATE_DELAY);
    },

    selectAddress(result, type) {

      let lat,lng,zoomLevel;

      if(type === 'places') {
        [lng,lat] = result.center;
        zoomLevel = result.properties.short_code ?
          this.COUNTRY_LEVEL_ZOOM : this.SEARCH_QUERY_ZOOM_LEVEL;
      } else {
        let loc = result.get('location');
        lat = loc.lat;
        lng = loc.lng;
        zoomLevel = this.SEARCH_QUERY_ZOOM_LEVEL;
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
          return bounds.contains(L.latLng(result.get('location')));
        });
        this.set('model', onScreenLocations);
      });
    }
  }
});
