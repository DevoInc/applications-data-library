import {
  getKeyNames,
  getIndex,
  checkData
} from '../utils/dataUtils';

function valueFoundWithinKeys(keys, value) {
  return (value != null && keys && keys.indexOf(value) >= 0);
}

function getValueIndexForTable(keys, valueToShow) {
  valueToShow = valueToShow.value || valueToShow;
  let retKey = [];
  if (Array.isArray(valueToShow) && valueToShow.length > 0) {
    valueToShow.forEach(value => {
      if (valueFoundWithinKeys(keys, value)) {
        retKey.push(value);
      }
    });
  } else if (valueToShow != null &&
    valueFoundWithinKeys(keys, valueToShow.value)) {

    retKey.push(valueToShow.value);
  } else {
    const totKeys = keys.length - 1;
    retKey.push(keys[totKeys]);
  }
  return retKey;
}

function getAllKeysIndexForTable(keys, settingsKeys) {
  let retKey = keys;
  if (Array.isArray(settingsKeys) && settingsKeys.length > 0) {
    retKey = settingsKeys.filter(el => keys.indexOf(el) >= 0);
  }
  return retKey;
}

export default (data, keysToShow, valueToShow, keysOrder) => {
  let ret = {
    'data': null,
    'kKeys': null,
    'kval': null,
    'error': 'NO DATA'
  };

  if (checkData(data)) {
    let keys = getKeyNames(data.keys);
    const valKeys = getValueIndexForTable(keys, valueToShow);
    let key = getAllKeysIndexForTable(keys, keysToShow);
    let elemTot = data.dataMatrix.length;
    let maxDepth = key.length;
    let isKeyOrdered = Array.isArray(keysOrder) && keysOrder.length <= maxDepth;
    const kKeys = isKeyOrdered ? keysOrder.length : key.length;
    const vKeys = valKeys.length;
    const totKeys = kKeys + vKeys;

    let returnData = [];
    returnData = [];
    for (let i = 0; i < totKeys; i += 1) {
      returnData[i] = [];
    }
    returnData[totKeys + 1] = isKeyOrdered ? keysOrder : key;
    for (let i = 0; i < elemTot; i += 1) {
      for (let j = 0; j < totKeys; j += 1) {
        let index = j < key.length ?
          getIndex(data.keys, key[j]) :
          getIndex(data.keys, valKeys);
        if (isKeyOrdered) {
          key = keysOrder;
        }
        returnData[j].push(data.dataMatrix[i][index]);
      }

    }

    ret = {
      'data': returnData,
      'kKeys': { 'keys': isKeyOrdered ? keysOrder : key },
      'kval': { 'value': valKeys },
      'error': null
    };
  }

  if (Array.isArray(ret.data)) {
    ret.data = ret.data.filter((elem) => elem.length != 0);
  }
  return ret;
};
