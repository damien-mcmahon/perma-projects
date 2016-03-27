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
const PRIVACY_ROUNDING = 3;

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
  privacyCircle: {},
  privacyCircleRadius: 200,
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

      let addressLine1 = address.address ?
        `${address.address} ${address.text}` : `${address.text}`;

      this.setProperties({
        'model.address_1': addressLine1,
        'model.city': addressDetails.city,
        'model.county': addressDetails.county,
        'model.postCode': addressDetails.postcode,
        'model.country': addressDetails.country
      });
    },
    setLocationPrivate(event) {
      let isChecked = event.target.checked;

      if(!isChecked) {
        //show a circle on the map
        let currentCoords = this.get('locationData');

        this.setProperties({
          privacyCircle: {
            lat: currentCoords.lat.toFixed(PRIVACY_ROUNDING),
            lng: currentCoords.lng.toFixed(PRIVACY_ROUNDING)
          }
        })
      } else {
        this.setProperties({
          privacyCircle:{}
        });
      }

      this.set('model.locationIsPublic', isChecked);

    },

    addProject(event) {
      event.preventDefault();
      let user = this.get('session.currentUser');
      let newProject = this.get('model');
      let locationData = this.get('locationData');
      let locationIsPublic = newProject.get('locationIsPublic');
      let userEmail = user.email ? user.email : '';

      if(!locationIsPublic) {
        newProject.setProperties({
          address_1: '',
          address_2: '',
          postCode: ''
        });
      }

      let projectLat = locationIsPublic ?
        locationData.lat : locationData.lat.toFixed(PRIVACY_ROUNDING);
      let projectLng = locationIsPublic ?
        locationData.lng : locationData.lng.toFixed(PRIVACY_ROUNDING);

      newProject.userId = user.id;
      newProject.setProperties({
        userId: user.id,
        userName: user.displayName,
        email: userEmail,
        createdAt: new Date().getTime(),
        location: {
          lat: projectLat,
          lng: projectLng
        }
      });

      newProject.save();
      this.transitionToRoute('projects');
    }
  }
});
