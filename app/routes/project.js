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
  afterModel(model) {
    let viewCount = model.get('views');
    if(viewCount) {
      viewCount++;
    } else {
      viewCount = 1;
    }
    model.set('views', viewCount);
    model.save();
  },
  serialize(model) {
    return {
      slugTitle: model.get('slugTitle')
    };
  }
});
