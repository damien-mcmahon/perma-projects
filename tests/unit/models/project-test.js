import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('project', 'Unit | Model | project', {

});

test('Location is correctly set', function(assert) {
    let model = this.subject();
    Ember.run(function() {
      model.setProperties({
        lat: -1,
        lng: 50
      });
      assert.deepEqual(model.get('location'), { lat: -1, lng: 50});
  });
});

test('Clipped Description set', function(assert){
  let model = this.subject();
  Ember.run(function(){
    let testDescription = `Lorem ipsum dolor sit amet,
    consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
    in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
    mollit anim id est laborum.`;

    model.set('description', testDescription);

    assert.equal(model.get('clippedDescription').length, 143);
  });
});
