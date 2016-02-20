import Ember from 'ember';

export default Ember.Component.extend({
  searchTerm: '136 Garratt Lane',
  actions: {
    search() {
      let searchAddress = this.get('searchTerm');
      this.get('search')(searchAddress);
    }
  }
});
