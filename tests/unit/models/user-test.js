import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('general users are not admin', function(assert) {
  let model = this.subject();
  assert.equal(model.get('isAdmin'), false);
});

test('users with role 99 are admins', function(assert) {
  let model = this.subject();
  Ember.run(()=>{
    model.set('role', 99);
    assert.equal(model.get('isAdmin'), true);
  });
});
