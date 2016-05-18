import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-results-box', 'Integration | Component | search results box', {
  integration: true
});

test('it renders', function(assert) {
  this.set('results', {'projects':[{title: 'test-1'}, {title: 'test-2'}]});
  this.render(hbs`{{search-results-box results=results}}`);

  assert.equal(
    this.$('li.search-results-box--item').length,
    2,
    'displays correct number of results'
  );
});
