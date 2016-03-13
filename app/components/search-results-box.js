import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: false,
  classNameBindings: ['isHidden'],
  actions: {
    select(address) {
      this.get('onselect')(address);
      this.set('isHidden', true);
      setTimeout(()=> {
        this.set('results', {});
        this.set('isHidden', false);
      }, 100);
    },
    closeList(){
      this.setProperties({
        results: {},
        isHidden: true
      });
      this.get('onclose')();
    }
  }
});
