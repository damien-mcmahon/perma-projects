import Ember from 'ember';

const SEARCH_QUERY_ZOOM_LEVEL = 10;
const COUNTRY_LEVEL_ZOOM = 5;

const MAP_STYLES = [
  {label: 'Default', url: 'https://[abc].tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'},
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

export default Ember.Mixin.create({
  COUNTRY_LEVEL_ZOOM: COUNTRY_LEVEL_ZOOM,
  SEARCH_QUERY_ZOOM_LEVEL: SEARCH_QUERY_ZOOM_LEVEL,
  mapStyles: MAP_STYLES,
  selectedStyle: MAP_STYLES[0],
  mapLocation: {
    lat: DEFAULTS.LOCATION.lat,
    lng: DEFAULTS.LOCATION.lng
  },
  zoomLevel: DEFAULTS.ZOOM,
  privacyCircleRadius: PRIVACY_CIRCLE_RADIUS
});
