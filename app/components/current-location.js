import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    getUserLocation() {
      navigator.geolocation.getCurrentPosition((Geo)=>{
          console.log("GEO: ", Geo);
      });
    }
  }
});
