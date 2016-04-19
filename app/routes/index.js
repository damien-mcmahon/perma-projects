import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.get('session').fetch().catch((err)=>{
      console.log("ERR", err);
    })
  },
  model() {
    return this.store.query('project', {
      limitToLast: 50
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    navigator.geolocation.getCurrentPosition((Geo)=>{
        if(Geo.coords) {
          this.controller.setProperties({
            mapLocation: {
              lat: Geo.coords.latitude,
              lng: Geo.coords.longitude
            }
          });
        }
    });
  }
});
