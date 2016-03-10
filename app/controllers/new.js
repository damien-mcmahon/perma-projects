import Ember from 'ember';

const DEFAULTS = {
  LOCATION: {
    lat: 52,
    lng: -1.4
  },
  ZOOM: 5,
  ADDRESS_ZOOM: 12
};

const MINIMUM_ZOOM_LEVEL = 11;

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  isSearching: false,
  zoomLevel: DEFAULTS.ZOOM,
  locationData: null,
  isDragging: false,
  searchResults: null,
  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
  actions: {
    mapDragging(event) {
      let mapCenter = event.target.getCenter();
      let currentZoomLevel = event.target.getZoom();
      let projectTitle = this.get('model.title');

      if(!Ember.isNone(projectTitle) && currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
        this.set('isDragging', true);
        this.set('centerPoint', {
          lat: mapCenter.lat,
          lng: mapCenter.lng
        });
      }
    },
    updateLocation(event) {
      let currentZoomLevel = event.target.getZoom();
      let projectTitle = this.get('model.title');
      let updateCenter = event.target.getCenter();

      this.set('isDragging', false);

      if(!Ember.isNone(projectTitle) && currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
        this.set('locationData', {
          lat: updateCenter.lat,
          lng: updateCenter.lng
        });
      } else {
        //spawn a message...
      }
    },
    onSearch(searchQuery) {
      this.set('isSearching', true);
      let mapBox = this.get('mapbox');
      mapBox.query(searchQuery).then((results) => {
        this.setProperties({
          isSearching: false,
          searchResults: results.features
        });
      });
    },
    selectAddress(addressCoords) {
      let [lat, lng] = addressCoords;

      this.setProperties({
        locationData: {
          lat: lat,
          lng: lng
        },
        mapLocation: {
          lat: lat,
          lng: lng
        },
        zoomLevel: DEFAULTS.ADDRESS_ZOOM
      });
    },
    addProject(event){
      event.preventDefault();
      let user = this.get('session.currentUser');
      let newProject = this.get('model');
      let locationData = this.get('locationData');
      let userEmail = user.email ? user.email : '';

      newProject.userId = user.id;
      newProject.setProperties({
        userId: user.id,
        userName: user.displayName,
        email: userEmail,
        createdAt: new Date().getTime(),
        location: {
          lat: locationData.lat,
          lng: locationData.lng
        }
      });

      newProject.save();
      transitionTo('index');
    }
  }
});
