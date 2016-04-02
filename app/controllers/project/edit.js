import Ember from 'ember';


const DEFAULTS = {
  LOCATION: {
    lat: 52,
    lng: -1.4
  },
  ZOOM: 12,
  ADDRESS_ZOOM: 12
};
const MINIMUM_ZOOM_LEVEL = 11;

export default Ember.Controller.extend({
  mapbox: Ember.inject.service(),
  zoomLevel: DEFAULTS.ZOOM,
  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
  searchResults: null,
  isSearching: false,
  isDragging: false,
  privacyCircleRadius: 50,
  updateLocationWhenDragging: false,
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
    onSearch(searchQuery) {
      this.set('isSearching', true);
      let mapBox = this.get('mapbox');
      mapBox.query(searchQuery).then((results) => {
        this.setProperties({
          isSearching: false,
          searchResults: {
            places: results.features
          }
        });
      });
    },

    mapDragging(event) {
      if(!this.updateLocationWhenDragging) return;
      let mapCenter = event.target.getCenter();
      let currentZoomLevel = event.target.getZoom();

      if(currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
        this.set('isDragging', true);
        this.set('centerPoint', {
          lat: mapCenter.lat,
          lng: mapCenter.lng
        });
      }
    },

    updateLocation(event) {
      if(!this.updateLocationWhenDragging) return;
      let currentZoomLevel = event.target.getZoom();
      let updateCenter = event.target.getCenter();
      let project = this.get('model');
      this.set('isDragging', false);

      if(currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
        project.setProperties({
          lat: updateCenter.lat,
          lng: updateCenter.lng
        });
      }
    },

    selectAddress(address) {
      let [lng, lat] = address.center;
      let addressDetails = this.extractAddress(address.context);
      let model = this.get('model');

      let addressLine1 = address.address ?
        `${address.address} ${address.text}` : `${address.text}`;

      model.setProperties({
        'model.address_1': addressLine1,
        'city': addressDetails.city,
        'county': addressDetails.county,
        'postCode': addressDetails.postcode,
        'country': addressDetails.country
      });
    },
    updateProject(event){
      event.preventDefault();
      let user = this.get('session.currentUser');
      let project = this.get('model');
      project.save();
      this.transitionToRoute('projects');
    }
  }
});
