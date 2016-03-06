import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: false,
  classNameBindings: ['isHidden'],
  actions: {
    select(coords) {
      let [lng, lat] = coords;
      this.get('onselect')([lat,lng]);
      this.set('isHidden', true);
    }
  }
});
