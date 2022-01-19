'use strict';
import { Request, param } from '../requests/Request';
import user from './user';

function loadUserPreferences (key) {
  return new Promise((resolve, reject) => {
    let data = {
      "scope": user.getDomain(),
      "dynamicKey": key
    };
    let queryString = param(data);
    let req = new Request();
    req.setMethod('GET');
    req.setURL(`generic/dynamic-preferences.json?${queryString}`);
    req.setHeader('x-origin', 'vapp');
    req.setHeader('Content-Type', 'application/json');

    req.call()
       .then(data => {
         let prefs = JSON.parse(data.object);
         resolve(prefs);
       }).catch(reject);
  });
}

function saveUserPreferences (d, key) {
  return new Promise((resolve, reject) => {
    let data = {
      "scope": user.getDomain(),
      "dynamicKey": key,
      "options": JSON.stringify(d)
    };
    let req = new Request();
    req.setMethod('POST');
    req.setURL('generic/dynamic-preferences.json');
    req.setHeader('x-origin', 'vapp');
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.payload = data;

    req.call().then(resolve).catch(reject);
  });
}

export default {
  loadUserPreferences,
  saveUserPreferences
}
