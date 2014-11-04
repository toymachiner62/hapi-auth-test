/**
 * Hapi.js server.
 *
 * @type {exports}
 */

var Hapi = require('hapi');
var modules = require('./modules');

// Instantiate the server
var server = new Hapi.Server('0.0.0.0', 3000, {
  cors: true,
  debug: {request: ['error']},
  cache: require('catbox-memory')
});

/**
 * Authorizes the user
 *
 * @returns {*}
 */
var authorize = function(request, callback) {
  callback(null, true);
}

server.method('authorize', authorize, { cache: { expiresIn: 10000 }});	// 1 minute

/**
 * Setup the server with plugins
 */
server.pack.register([], function(err) {

  // If there is an error on server startup
  if(err) {
    throw err;
  }

  /**
   * Intercept requests to perform authorization
   */
  server.ext('onPostAuth', function (request, next) {

    // TODO: Fix this error. It currently doesn't always use the cache because of it
    // Causes [Cannot display object: Converting circular structure to JSON] and doesn't actually use cache
    server.methods.authorize(request, function(err, result) {

      console.log('in server.methods.authorize callback');

      if(err) {
        next(err);
      }

      if(result) {
        next(null);
      }

    });

    // Works without [Cannot display object: Converting circular structure to JSON}, but no cache
    /*authorize(request, function(err, result) {
     if(err) {
     next(err);
     }

     if(result) {
     next(null);
     }
     });*/
  });

  /**
   * Make sure if this script is being required as a module by another script, we don't start the server.
   */
  if(!module.parent) {

    /**
     * Starts the server
     */
    server.start(function () {
      console.log('Hapi server started @', server.info.uri);
    });
  }

});

/**
 * Add all the modules within the modules folder
 */
for(var route in modules) {
  server.route(modules[route]);
}


/**
 * Expose the server's methods when used as a require statement
 *
 * @type {exports.server}
 */
module.exports = server;

