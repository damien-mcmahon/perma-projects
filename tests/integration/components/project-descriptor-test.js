import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('project-descriptor', 'Integration | Component | event descriptor', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.set('project', {
    title: 'A test project',
    clippedDescription: 'lorem dolor sit amet'
  });

  this.render(hbs`{{project-descriptor project=project}}`);

  assert.equal(
    this.$('h2.project--title').text().trim(),
    'A test project'
  );
});
