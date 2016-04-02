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
  updateLocationWhenDragging: false,
  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
  slugerizeTitle(unsafeTitle) {
    const STRIP_CHARS_REGEX = /[^a-z0-9\-\s]/gi;
    const DASH_STRIP_REGEX = /^-|-$/g;
    const STRIP_REPLACE_VALS = '';
    const SPLIT_CHAR = ' ';
    const JOIN_CHAR = '-';

    return unsafeTitle
      .toLowerCase()
      .replace(STRIP_CHARS_REGEX, STRIP_REPLACE_VALS)
      .replace(DASH_STRIP_REGEX, STRIP_REPLACE_VALS)
      .split(SPLIT_CHAR)
      .join(JOIN_CHAR);
  },
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
  },
  actions: {
    checkAndSluggerizeTitle() {
      let model = this.get('model');
      let title = model.get('title');
      let slugTitle = this.slugerizeTitle(title);

      this.store.query('project', {
        orderBy: 'slugTitle',
        equalTo: slugTitle
      }).then((results) => {
        if(results.content.length) {
          model.set('slugTitle', `${slugTitle}-${results.content.length}`);
        } else {
          model.set('slugTitle', slugTitle);
        }
      });
    },
    mapDragging(event) {
      if(!this.updateLocationWhenDragging) return;
      let mapCenter = event.target.getCenter();
      let currentZoomLevel = event.target.getZoom();

      if(!Ember.isNone(projectTitle) &&
        currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
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
      let project = this.get('model');
      let updateCenter = event.target.getCenter();
      let mapBox = this.get('mapbox');

      this.set('isDragging', false);

      if(currentZoomLevel >= MINIMUM_ZOOM_LEVEL) {
        this.set('locationData', {
          lat: updateCenter.lat,
          lng: updateCenter.lng
        });
      }

      //if there's no address do a reverse geocode and grab the nearest region & country
      if(!project.get('county') && !project.get('country')){
        mapBox.query(`${updateCenter.lng.toFixed(3)},${updateCenter.lat.toFixed(3)}`)
        .then((results) => {
          let addressDetails = this.getPostcodeFromCoord(results);
          if(addressDetails.country) {
            project.setProperties({
              county: addressDetails.region,
              country: addressDetails.country,
              postCode: addressDetails.postCode || ''
            });
          }
        });
      }
    },
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
        });
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

      newProject.setProperties({
        userId: user.id,
        userName: user.displayName,
        email: userEmail,
        createdAt: new Date().getTime(),
        lat: projectLat,
        lng: projectLng
      });

      if(user.id) {
        newProject.save();
        this.transitionToRoute('projects');
      } else {
        alert("You need to be logged in");
      }
    }
  }
});
