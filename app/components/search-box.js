import Ember from 'ember';

export default Ember.Component.extend({
  searchTerm: '',
  isSearching: false,
  didReceiveAttrs(attrs) {
    this._super(...arguments);
    this.set('isSearching', attrs.newAttrs.searching);
  },
  actions: {
    setSearch(){
      if(this.get('searchTerm').length){
        this.set('isSearching', false);
      }
    },
    search() {
      let searchAddress = this.get('searchTerm');
      this.set('isSearching', true);
      if(searchAddress.length){
        this.get('search')(searchAddress);
      }
    },
    resultSelected(result){
      this.set('searchTerm', '');
      this.get('onSelect')(result);
    }
  }
});
