import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-button', 'Integration | Component | user button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.set('user', {
    displayName: 'Test User'
  });

  this.render(hbs`{{user-button user=user}}`);

  assert.equal(this.$('.user-button--name').text(), 'Test User', 'displays the username');
});
