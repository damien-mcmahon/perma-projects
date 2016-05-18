import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('facebook-like', 'Integration | Component | facebook like', {
  integration: true
});

test('it renders', function(assert) {
  //TODO: Make this test less WEAK!
  // Template block usage:"
  this.render(hbs`
    {{#facebook-like}}{{/facebook-like}}
  `);

  assert.equal(this.$().text().trim(), '');
});
