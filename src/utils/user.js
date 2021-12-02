/**
 * Retrive the user data from the session
 * @module user
 */
 import dependencies from './dependencies';
 const userInfo = dependencies.require('userInfo');
 const user = {};


/**
 * Get credentials object
 * @function getCredentials
 * @return {Object} Credentials object
 */
user.getCredentials = () => userInfo.credentials;

/**
 * Get user name
 * @function getName
 * @return {String} User name
 */
user.getName = () => userInfo.name;

/**
 * Get user email
 * @function getEmail
 * @return {String} User email
 */
user.getEmail = () => userInfo.email;

/**
 * Get user locale
 * @function getLocale
 * @return {String} User locale
 */
user.getLocale = () => userInfo.locale;

/**
 * Get user applications
 * @function getApplications
 * @return {Object} User applications
 */
user.getApplications = () => userInfo.applications;

 /**
  * Get the user timezone
  * @function getTimezone
  * @return {String} Timezone string
  */
user.getTimezone = () => userInfo.timezone;

/**
 * Get the user domain
 * @function getDomain
 * @return {String} Domain string
 */
user.getDomain = () => userInfo.domain;

/**
 * Get the user vault
 * @function getVault
 * @return {Object} Vault object
 */
user.getVault = () => userInfo.vault;

//user.getVault = () => userInfo.vault;

export default user;
