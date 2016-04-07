import Ember from 'ember';
import MappingMixin from 'projects/mixins/mapping';
import { module, test } from 'qunit';

module('Unit | Mixin | mapping');

// Replace this with your real tests.
test('it works', function(assert) {
  let MappingObject = Ember.Object.extend(MappingMixin);
  let subject = MappingObject.create();
  assert.ok(subject);
});
