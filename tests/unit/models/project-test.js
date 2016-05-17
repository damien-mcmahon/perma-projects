import { moduleForModel, test } from 'ember-qunit';

moduleForModel('project', 'Unit | Model | project', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('Location is correctly set', function(assert) {
  let model = this.subject();
  model.setProperties({
    lat: -1,
    lng: 50
  });

  assert.equal(model.get('location'), '-1, 50');
});
