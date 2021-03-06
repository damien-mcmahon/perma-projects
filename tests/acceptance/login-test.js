import { test } from 'qunit';
import moduleForAcceptance from 'projects/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /login', function(assert) {
  visit('/login');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

// test('can login', function(assert){
//   visit('/login');
//   click('button.email-sign-in');
//   fillIn('#email', 'test@example.com');
//   fillIn('#password', 'testing123');
//   click('#email-sign-in--button');
//
//   andThen(function(){
//     assert.equal(currentURL(), '/login');
//   });
// });

// test('can reset password if forgotten');
// test('when logging out, user taken back to home page');
