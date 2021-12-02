import { checkData, getGkLen, getKeyNames, isValidValue, getIndex } from
  '../utils/dataUtils';

export default (data, keysToShow, valToShow) => {
  let returnData;
  let gkLen;

  if (checkData(data)) {
    gkLen = getGkLen(data.keys);
    if (gkLen >= 1) {
      returnData = getValues(data, keysToShow, valToShow);
    } else {
      returnData.error = 'INVALID_COLUMN_NUMBER';
    }
  } else {
    returnData = null;
  }
  return returnData;
};

function getValues(data, keyToShow, valToShow) {
  let keys = getKeyNames(data.keys);
  let totKeys = keys.length;
  let size = data.dataMatrix.length;
  let kVal = getIndex(data.keys, valToShow);
  let validData = 0;
  let ret = [];
  for (let i = 0; i < size; i += 1) {
    let name = '';
    for (let j = 0; j < totKeys; j += 1) {
      name += isValidValue(data.keys[j]) ?
      data.dataMatrix[i][j] + ' - ' : '';
    }
    name = name != '' ? name.substr(0, name.length - 3) : '';
    let val = data.dataMatrix[i][kVal];
    if (isFinite(val)) {
      validData += 1;
      ret.push({'name': name, 'val': Number(val)});
    }
  }
  if (validData > 0) {
    return ret;
  } else {
    return 'INVALID_DATA';
  }
}
