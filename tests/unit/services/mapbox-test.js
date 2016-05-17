import { moduleFor, test } from 'ember-qunit';
import config from '../../../config/environment';
import startMirage from '../../helpers/mirage-initializer';

const MAPBOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

moduleFor('service:mapbox', 'Unit | Service | mapbox', {});

test('cleanQuery()', function(assert){
  assert.expect(2);

  let mapBox = this.subject();
  let stringToTest = 'string with spaces';

  assert.equal(
    mapBox.cleanQuery(stringToTest),
    'string+with+spaces',
    'spaces in query are replaced with a plus'
  );

  stringToTest = 'UPPERCASE';

  assert.equal(
    mapBox.cleanQuery(stringToTest),
    'uppercase',
    'uppercase chars are made lowercase'
  );
});

test('buildQueryUrl()', function(assert) {
  assert.expect(1);
  let mapBox = this.subject();
  //TODO: E_TOO_MUCH_HARD_CODING...
  let urlString =
    `${MAPBOX_URL}some+place.json?access_token=${config.mapboxAPIKey}`;
  assert.equal(
    mapBox.buildQueryUrl('some place'),
    urlString,
    'builds a cleaned request via json'
  );
  //could test different formats but won't for now...
});

test('query()', function(assert) {
  startMirage(this.container);

  let mapBox = this.subject();
  let query = mapBox.query('Purlewent Drive');

  query.then((response) => {
    assert.equal(
      response.features.length,
      1,
      'it returns a set of results'
    );
  });

  window.server.shutdown();
});
