import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('current-location', 'Integration | Component | current location', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  // Template block usage:"
  this.render(hbs`
    {{#current-location}}{{/current-location}}
  `);

  assert.equal(this.$('.fa').length, 1, 'it shows an icon');
});
