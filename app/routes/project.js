import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.store.query('project', {
      orderBy: 'slugTitle',
      equalTo:params.slugTitle
    }).then((response) => {
      return response.get('firstObject');
    });
  },
  serialize(model) {
    return {
      slugTitle: model.get('slugTitle')
    };
  }
});
