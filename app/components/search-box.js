import Ember from 'ember';

export default Ember.Component.extend({
  searchTerm: '',
  isSearching: false,
  hasSearchResults: false,
  didReceiveAttrs(attrs) {
    this._super(...arguments);
    let newAttrs = attrs.newAttrs;
    this.set('isSearching', newAttrs.searching);

    if(newAttrs.results) {
      let results = newAttrs.results.value;
      let resultKeys = results ? Object.keys(results) : [];

      resultKeys.map((key) => {
        if(results[key] && results[key].length) {
          this.set('hasSearchResults', true);
        }
      });
    }
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

    resultSelected(result, type){
      this.set('searchTerm', '');
      this.get('onSelect')(result, type);
    },

    closeSearch() {
      this.setProperties({
        isSearching: false
      });
    }
  }
});
