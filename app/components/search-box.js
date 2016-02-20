import Ember from 'ember';

export default Ember.Component.extend({
  searchTerm: '',
  actions: {
    search() {
      let searchAddress = this.get('searchTerm');
      this.get('search')(searchAddress);
    }
  }
});
