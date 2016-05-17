import Ember from 'ember';
import config from '../config/environment';

const API_HOST = 'https://api.mapbox.com/';
const API_PATH = 'geocoding/v5/';
const API_DATA_SET = 'mapbox.places';

export default Ember.Service.extend({
  cleanQuery(query) {
    const SPACES_REGEX = /\s/g;
    const REPLACE_CHAR = '+';
    return query.toLowerCase().replace(SPACES_REGEX, REPLACE_CHAR);
  },

  buildQueryUrl(query, apiDataSet = API_DATA_SET, format = 'json') {
    let cleanQuery = this.cleanQuery(query);
    return `${API_HOST}${API_PATH}${apiDataSet}/${cleanQuery}.${format}?access_token=${config.mapboxAPIKey}`;
  },
  
  query(query) {
    return Ember.$.ajax(this.buildQueryUrl(query));
  }
});
