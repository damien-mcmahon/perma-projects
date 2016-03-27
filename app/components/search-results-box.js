import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: false,
  showCloseButton: true,
  classNameBindings: ['isHidden'],
  actions: {
    select(result, type) {
      this.get('onselect')(result, type);
      this.setProperties({
        'isHidden': true,
        'showCloseButton': false
      });

      setTimeout(() => {
        this.set('results', {});
        this.set('isHidden', false);
      }, 100);
    },

    closeList() {
      this.setProperties({
        results: {},
        isHidden: true
      });
      this.get('onclose')();
    }
  }
});
