import Ember from 'ember';

export default Ember.Component.extend({
  isFinding: false,
  actions: {
    getUserLocation() {
      this.set('isSearching', true);
      navigator.geolocation.getCurrentPosition((Geo)=>{
          if(Geo.coords) {
            this.get('onFind')(Geo.coords);
          }
        this.set('isSearching', false);
      });
    }
  }
});
