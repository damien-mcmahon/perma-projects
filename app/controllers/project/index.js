import Ember from 'ember';

const SELECTED = {label: 'Default', url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'}
export default Ember.Controller.extend({
  selectedStyle: SELECTED,
  zoomLevel: 13
});
