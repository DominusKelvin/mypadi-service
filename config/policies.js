/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  '*': 'is-logged-in',
  'home/index': true,
  'user/signup': true,
  'user/signin': 'can-signin',
  'user/forgot-password': 'can-signin',
  'user/reset-password': true,
  'user/confirm': true,
  'listing/update': ['is-logged-in', 'is-listing-owner'],
  'listing/delete': ['is-logged-in', 'is-listing-owner']

};
