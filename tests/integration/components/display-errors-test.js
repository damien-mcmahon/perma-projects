import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('display-errors', 'Integration | Component | display errors', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  // Template block usage:"
  this.setProperties({
    'errors': ["something went wrong"],
    showErrors: true
  });
  
  this.render(hbs`
    {{#display-errors
      errors=errors
      showErrors=showErrors
    }}{{/display-errors}}`);


  assert.equal(
    this.$('span.input-error').text().trim(),
    'something went wrong',
    'error messages are displayed'
  );
});
