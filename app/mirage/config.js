export default function() {
  this.get('https://api.mapbox.com/geocoding/v5/mapbox.places/:query', function(){
    return {
      "type":"FeatureCollection",
      "query":["purlewent","drive"],
      "features":[{
        "id":"address.17819718615148260",
        "type":"Feature",
        "text":"Purlewent Drive",
        "place_name":"Purlewent Drive, Bath and North East Somerset, Bath and North East Somerset BA1 4BD, United Kingdom",
        "relevance":0.79,
        "properties":{},
        "center":[-2.386096,51.396785],
        "geometry": {
          "type":"Point",
          "coordinates":[-2.386096,51.396785]
        },
        "context":[{
            "id":"place.7791",
            "text":"Bath and North East Somerset"
          },{
            "id":"postcode.13321637641760830",
            "text":"BA1 4BD"
          },{
            "id":"region.2299996767900",
            "text":"Bath and North East Somerset",
            "short_code":"GB-BAS",
            "wikidata":"Q810793"
          },{
            "id":"country.15810817285254780",
            "text":"United Kingdom",
            "short_code":"gb",
            "wikidata":"Q145"
          }]
        }],
        "attribution":"NOTICE: © 2016 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained."};
  });
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Route shorthand cheatsheet
  */
  /*
    GET shorthands

    // Collections
    this.get('/contacts');
    this.get('/contacts', 'users');
    this.get('/contacts', ['contacts', 'addresses']);

    // Single objects
    this.get('/contacts/:id');
    this.get('/contacts/:id', 'user');
    this.get('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    POST shorthands

    this.post('/contacts');
    this.post('/contacts', 'user'); // specify the type of resource to be created
  */

  /*
    PUT shorthands

    this.put('/contacts/:id');
    this.put('/contacts/:id', 'user'); // specify the type of resource to be updated
  */

  /*
    DELETE shorthands

    this.del('/contacts/:id');
    this.del('/contacts/:id', 'user'); // specify the type of resource to be deleted

    // Single object + related resources. Make sure parent resource is first.
    this.del('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    Function fallback. Manipulate data in the db via

      - db.{collection}
      - db.{collection}.find(id)
      - db.{collection}.where(query)
      - db.{collection}.update(target, attrs)
      - db.{collection}.remove(target)

    // Example: return a single object with related models
    this.get('/contacts/:id', function(db, request) {
      var contactId = +request.params.id;

      return {
        contact: db.contacts.find(contactId),
        addresses: db.addresses.where({contact_id: contactId})
      };
    });

  */
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
