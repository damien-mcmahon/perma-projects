import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-box', 'Integration | Component | search box', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.setProperties('placeholderText', 'Search For Projects or places');
  // Template block usage:"
  this.render(hbs`
    {{#search-box placeholderText=placeholderText}}{{/search-box}}
  `);

  //TODO: Stop with the weak tests
  assert.equal(
    this.$('input.search-box--query').text().trim(),
    ''
  );
});
