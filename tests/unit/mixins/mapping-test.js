import Ember from 'ember';
import MappingMixin from 'projects/mixins/mapping';
import { module, test } from 'qunit';

let testAddressContext = [{
    "id":"place.1234",
    "text":"Bath and North East Somerset"
  },{
    "id":"postcode.12345",
    "text":"BA1 4XX"
  },{
    "id":"region.123456",
    "text":"Bath and North East Somerset",
  },{
    "id":"country.1234567",
    "text":"United Kingdom"
  }];

let subject;

module('Unit | Mixin | mapping', {
  beforeEach: function(){
    let MappingObject = Ember.Object.extend(MappingMixin);
    subject = MappingObject.create();
  }
});

test('extractAddress()', function(assert) {
  let expectedResponse = {
    city: "Bath and North East Somerset",
    county: "Bath and North East Somerset",
    country: "United Kingdom",
    postcode: "BA1 4XX"
  };

  assert.deepEqual(
    subject.extractAddress(testAddressContext),
    expectedResponse,
    'it extracts city, county, country and postcode'
  );

  //delete place
  testAddressContext.splice(0,1);
  delete expectedResponse.city;

  assert.deepEqual(
    subject.extractAddress(testAddressContext),
    expectedResponse,
    'it extracts county, country and postcode'
  );

  testAddressContext.splice(0,1);
  delete expectedResponse.postcode;

  assert.deepEqual(
    subject.extractAddress(testAddressContext),
    expectedResponse,
    'it extracts country and country'
  );

  testAddressContext.splice(0,1);
  delete expectedResponse.county;

  assert.deepEqual(
    subject.extractAddress(testAddressContext),
    expectedResponse,
    'it extracts country'
  );

  assert.deepEqual(
    subject.extractAddress([]),
    {},
    'blank context returns a blank object'
  );
});

test('getDetailsFromPlace()', function(assert) {
  assert.expect(0);
});
