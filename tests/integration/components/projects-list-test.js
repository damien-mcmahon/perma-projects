import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('projects-list', 'Integration | Component | projects list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.set('projects', [{
    title: "Test Project 1"
  }, {
    title: "Test Project 2"
  }]);

  this.render(hbs`{{projects-list projects=projects}}`);

  return wait().then(()=>{
    assert.equal(
      this.$('li.projects-list--project').length,
      2,
      'it renders the correct number of projects'
    );
  });
});
