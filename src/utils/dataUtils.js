'use strict';

export function getRowByKey(data, key){
  var idx = getIndex(data.keys, key)
  if (idx >= 0) return data.dataMatrix.map((elem) => elem[idx]);
  return;
}


export function getRowsByKeys(data, keys){
  return keys.map ((key) => getRowByKey(data, key));
}

export function getIndex(arr, key) {
	return	key ?
				arr.findIndex( (el) => el.name ?
					// If the key is an array, then search the el.name value into key-array
					Array.isArray(key) ? key.indexOf(el.name) > -1 : el.name.toString() === key.toString()
				: el.toString() === key.toString()
			) : -1;
}

export const getColumn = (data, idx) =>  data.dataMatrix.map( (el) => el[i]);


export function getKeyNames(arr){
  return arr.map( dataKey => dataKey.name );
}

export function getRowByValue (data, key, value) {
  let idx = getIndex(data.keys, key);
  return data.dataMatrix.filter( el => el.includes(value))
    .map( (el) => el[idx])
}

export function getOneKeyIndex(keys, value) {
  var key;
  for (key of keys) {
    if (key.name != 'client' && key.name == value) {
      return keys.indexOf(key);
    }
  }
  return;
};

export function getGkLen (keys){
  var gkLen = getIndex(keys, 'client') != -1 ? keys.length - 2 :
     keys.length - 1;
  return gkLen;
}

export function isValidValue(val) {
  return val && val != 0 ? true : false;
};

export function getAllKeysIndex(keys, settingsKeys,valueToShow) {
  var key;
  var retKey = [];
  var i = 0
  var totKeys;
  if (Array.isArray(settingsKeys) && settingsKeys.length > 0) {
    totKeys = settingsKeys.length;
    for (i; i < totKeys; i += 1) {
      retKey.push(getIndex(keys, settingsKeys[i]));
    }
  } else {
    getOneKeyIndex(keys, valueToShow)
  }
  return retKey;
};

export function getkeyUniqueValues(data, key) {
  let tmp = new Set();
  let row = getRowByKey(data, key);
  row.map( el => tmp.add(el));
  return key ?  Array.from(tmp) : null;
}

export function uniques (arr, key) {
  let tmp = new Set();
  return Array.from(arr.forEach(val => tmp.add(key ? val[key] : val)));
}

export function checkData (data) {
  return data && Array.isArray(data.dataMatrix) &&
  data.dataMatrix.length > 0 && Array.isArray(data.keys)
}


