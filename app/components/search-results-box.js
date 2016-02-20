import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: false,
  classNameBindings: ['isHidden'],
  actions: {
    select(coords) {
      this.get('onselect')(coords);
      this.set('isHidden', true);
    }
  }
});
