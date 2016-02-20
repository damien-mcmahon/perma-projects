import Ember from 'ember';
import config from '../config/environment';

const API_HOST = 'https://api.mapbox.com/';
const API_PATH = 'geocoding/v5/';
const API_DATA_SET = 'mapbox.places';

export default Ember.Service.extend({
  buildQueryUrl(query, apiDataSet = API_DATA_SET, format = 'json'){
    let cleanQuery = query.toLowerCase().replace(/\s/g, '+');
    return `${API_HOST}${API_PATH}${apiDataSet}/${cleanQuery}.${format}?access_token=${config.mapboxAPIKey}`;
  },
  query(query){
    return Ember.$.ajax(this.buildQueryUrl(query));
  }
});
