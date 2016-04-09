import Ember from 'ember';
import Mapping from '../../mixins/mapping';

const PRIVACY_ROUNDING = 3;

export default Ember.Controller.extend(Mapping, {
  mapbox: Ember.inject.service(),
  isSearching: false,
  locationData: null,
  isDragging: false,
  searchResults: null,
  privacyCircle: {},
  privacyCircleRadius: this.PRIVACY_CIRCLE_RADIUS,
  updateLocationWhenDragging: false,
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
      if(!this.updateLocationWhenDragging) {
        return;
      }
      let mapCenter = event.target.getCenter();
      let currentZoomLevel = event.target.getZoom();

      if(currentZoomLevel >= this.MINIMUM_ZOOM_LEVEL) {
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

      if(currentZoomLevel >= this.MINIMUM_ZOOM_LEVEL) {
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
        zoomLevel: this.DEFAULTS.ADDRESS_ZOOM
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
        let stats = this.store.query('stat', {
          limitToLast: 1
        }).then((stats) => {
          //@TODO: extract this into a better pattern
          let stat = stats.get('firstObject');
          let projectCountries = stat.get('projectsByCountry');
          let newProjectCountry = newProject.get('country');

          if(projectCountries[newProjectCountry]){
            let currentCount = projectCountries[newProjectCountry];
            projectCountries[newProjectCountry] = ++currentCount;
          } else {
            projectCountries[newProjectCountry] = 1;
          }
          let currentProjectsCount = stat.get('totalProjects');

          stat.setProperties({
            totalProjects: ++currentProjectsCount,
            projectsByCountry: projectCountries
          });

          stat.save();

          this.transitionToRoute('projects');
        })


      } else {
        alert("You need to be logged in");
      }
    }
  }
});
