import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 15;
const COUNTRY_LEVEL_ZOOM = 5;

const MAP_STYLES = [
  {label: 'Default', url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'},
  {label: 'Landscape', url: 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'},
  {label: 'Outdoors', url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'},
  {label: 'Terrain', url: 'https://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'},
  {label: 'OSM', url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'}
];
const DEFAULTS = {
  LOCATION: {
    lat: 51.47685,
    lng: 0
  },
  ZOOM: 8
};

const PRIVACY_CIRCLE_RADIUS = 100;
const DETECT_RETINA = true

export default Ember.Mixin.create({
  COUNTRY_LEVEL_ZOOM: COUNTRY_LEVEL_ZOOM,
  SEARCH_QUERY_ZOOM_LEVEL: SEARCH_QUERY_ZOOM_LEVEL,
  DETECT_RETINA: DETECT_RETINA,
  DEFAULTS: DEFAULTS,
  mapStyles: MAP_STYLES,
  selectedStyle: MAP_STYLES[0],
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  zoomLevel: DEFAULTS.ZOOM,
  privacyCircleRadius: PRIVACY_CIRCLE_RADIUS,
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

  getDetailsFromPlace(place){
    let postCodeDetails = {};
    place.context.map((contextItem) => {
      const CONTEXT_POSTCODE_REG = /postcode/i;
      const CONTEXT_REGION_REG = /region/i;
      const CONTEXT_COUNTRY_REG = /country/i;

      if(CONTEXT_COUNTRY_REG.test(contextItem.id)) {
        postCodeDetails.country = contextItem.text
      }

      if(CONTEXT_POSTCODE_REG.test(contextItem.id)) {
        postCodeDetails.postCode = contextItem.text
      }

      if(CONTEXT_REGION_REG.test(contextItem.id)) {
        postCodeDetails.region = contextItem.text
      }
    });
    return postCodeDetails;
  },
  getPostcodeFromCoord(results) {
    let postCodeFeature = results.features.filter((feature) => {
      const ADDRESS_REG_EX = /address/gi;
      return ADDRESS_REG_EX.test(feature.id);
    });

    if(!postCodeFeature.length) {
      postCodeFeature = results.features.filter((feature)=> {
        const POSTCODE_REG_EX = /postcode/gi;
        return POSTCODE_REG_EX.test(feature.id);
      });
    }

    return this.getDetailsFromPlace(postCodeFeature[0]);
  }
});
