/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /": "home",
  "POST /user/signup": "user/signup",
  "POST /user/signin": "user/signin",

  // Listing
  "POST /listing/new": "listing/new",

  //Get all the listings of the logged in user
  "GET /listing/me": "listing/my-listings",

  //Allow a logged in user to update his listing
  "PUT /listing/me/:id": "listing/update",

  //Let a user delete any of his listing
  "DELETE /listing/me/:id": "listing/delete"

};
