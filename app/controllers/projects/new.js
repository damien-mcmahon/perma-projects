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
  extractAddress(context) {
    let CITY_REG_EX = /place\.(\d+)/gi;
    let COUNTY_REG_EX = /region\.(\d+)/gi;
    let POST_CODE_REG_EX = /postcode\.(\d+)/gi;
    let COUNTRY_REG_EX = /country\.(\d+)/gi;
    let address = {};

    context.map((type) => {
      if(CITY_REG_EX.test(type.id)){
        address.city = type.text;
      }

      if(COUNTY_REG_EX.test(type.id)){
        address.county = type.text;
      }

      if(COUNTRY_REG_EX.test(type.id)) {
        address.country = type.text;
      }

      if(POST_CODE_REG_EX.test(type.id)){
        address.postcode = type.text;
      }
    });

    return address;
  },
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
        console.log("ADDRESS DEETS: ", results);
        this.setProperties({
          isSearching: false,
          searchResults: results.features
        });
      });
    },
    selectAddress(address) {
      let [lng, lat] = address.center;
      let addressDetails = this.extractAddress(address.context);

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

      this.setProperties({
        'model.address_1': `${address.address} ${address.text}`,
        'model.city': addressDetails.city,
        'model.county': addressDetails.county,
        'model.postCode': addressDetails.postcode,
        'model.country': addressDetails.country
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
      this.transitionToRoute('projects');
    }
  }
});
