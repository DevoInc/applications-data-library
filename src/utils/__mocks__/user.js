/**
 * Retrive the user data from the session
 * @module user
 */
let user = {};
if (typeof requesito !== 'undefined')
  user = requesito.require('lt-web/base/UserMetadata.js');

/**
 * Get metadata object
 * @function getMetaData
 * @return {Object} Metadata object
 */
user.getMetaData = () => ({
  'credential': {
    'apiKey': 'apiKey',
    'apiSecret': 'apiSecret',
    'serrea': 'serrea'
  }
})

/**
 * Get credentials object
 * @function getCredentials
 * @return {Object} Metadata object
 */
user.getCredentials = () => ({
  'apiKey': 'apiKey',
  'apiSecret': 'apiSecret',
  'serrea': 'serrea',
  'standAloneToken': 'standAloneToken'
})

/**
 * Get user role
 * @function getRole
 * @return {Object} Role object
 */

/**
 * Get user name
 * @function getName
 * @return {String} User name
 */
user.getName = () => 'test'
/**
 * Get user domain
 * @function getDomain
 * @return {String} User domain
 */
user.getDomain = () => 'test'
/**
 * Get user email
 * @function getEmail
 * @return {String} User email
 */
user.getEmail = () => 'test@test.com'

/**
 * Get user ID
 * @function getId
 * @return {String} User ID
 */

/**
 * Get user applications
 * @function getApplications
 * @return {Object} User applications
 */

/**
 * Get user menu items
 * @function getMenuItems
 * @return {Object} User menu items
 */

/**
 * Get user widgets
 * @function getWidgets
 * @return {Object} User widgets
 */

/**
 * Get user email MD5
 * @function getEmailMd5
 * @return {String} User email MD5
 */

/**
 * Get the user timezone
 * @function getTimezone
 * @return {String} Timezone string
 */
user.getTimezone = () => 'UTC';

user.getVault = () => ({
  'name': ''
});

user.getVault = () => ({
  'name': ''
});

export default user;
