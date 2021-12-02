import { checkData, getIndex, getAllKeysIndex, isValidValue } from
  '../utils/dataUtils';

export default (data, keysToShow, valToShow) => {
  let returnData = null;
  if (checkData(data)) {

    let gkLen = getIndex(data.keys, 'client') != -1 ? data.keys.length - 1 :
      data.keys.length;
    if (gkLen >= 1) {
      returnData = getValues(data, keysToShow, valToShow);
    } else {
      returnData = 'INVALID_COLUMN_NUMBER';
    }
  } else {
    returnData = 'NO_DATA';
  }
  return returnData;
};

function getValues (data, keysToShow, valToShow) {
    let keys = getAllKeysIndex(data.keys, keysToShow);
    let totKeys = data.keys.length;
    let size = data.dataMatrix.length;
    let kVal = getIndex(data.keys, valToShow);
    let validData = 0;
    let ret = [];
    for (let i = 0; i < size; i += 1) {
      let name = '';
      for (let j = 0; j < totKeys; j += 1) {
        name += isValidValue(data.dataMatrix[i][keys[j]]) ?
        data.dataMatrix[keys[j]] + ' - ' : '';
      }
      name = name != '' ? name.substr(0, name.length - 3) : '';
      let val = data.dataMatrix[i][kVal];
      if (isFinite(val)) {
        validData += 1;
        ret.push({name: name, val: Number(val)});
      }
    }
    if (validData > 0) {
      return ret;
    } else {
      return 'INVALID_DATA';
    }
  }
