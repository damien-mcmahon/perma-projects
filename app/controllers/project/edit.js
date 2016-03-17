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
  zoomLevel: DEFAULTS.ZOOM,
  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
  searchResults: null,
  isSearching: false,
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
          searchResults: results.features
        });
      });
    },
    selectAddress(address) {
      let [lng, lat] = address.center;
      let addressDetails = this.extractAddress(address.context);
      console.log("ADD: ", addressDetails);
      let model = this.get('model');

      model.setProperties({
        'address_1': `${address.address} ${address.text}`,
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
