import { getGkLen, getIndex, getOneKeyIndex, isValidValue, checkData } from
  '../utils/dataUtils';

export default (data, minPct, keysToShow, valueToShow) => {
  var returnData;
  var gkLen;
  if (checkData(data)) {
    gkLen = getGkLen(data.keys);
    if (gkLen >= 1) {
      //1 Sola clave
      if (gkLen == 1) {
        returnData = getValuesForOneKey(data, minPct, keysToShow, valueToShow);
      }
      //2 Claves
      else {
        returnData = getValuesForTwoKeys(data, minPct, keysToShow, valueToShow);
      }
    } else {
      returnData = 'INVALID_COLUMN_NUMBER';
    }
  } else {
    returnData = 'NO_DATA';
  }
  return returnData;
};

function getValuesForOneKey(data, minPercent, keysToShow, valueToShow) {
  var kVal = null;
  var kOrigDest = null;
  if (valueToShow.value === 'count50'){
    kVal = getIndex(data.keys, 'count');
    kOrigDest = getOneKeyIndex(data.keys, 'count');
  } else {
    var kVal = getIndex(data.keys, valueToShow.value || valueToShow);
    kOrigDest = getOneKeyIndex(data.keys, valueToShow.value || valueToShow);
  }
  var i;
  var srcDest;
  var val;
  var source = [];
  var target = [];
  var value = [];
  var size = data.dataMatrix.length;
  var validData = 0;
  var pct = [];
  var minPct = typeof minPercent == "undefined" ? 0 : Number(minPercent) / 100;
  var keysKey;
  var valueKey;
  for (i = 0; i < size; i += 1) {
    if (isValidValue(data.dataMatrix[i][kOrigDest])) {
      srcDest = [keysToShow.source, keysToShow.target];
      val = parseFloat(data.dataMatrix[i][kVal]);
      if (Array.isArray(srcDest) && srcDest.length == 2 && isFinite(val) &&
        Number(val) != 0 && data.dataMatrix[i][kVal] > 0 &&
        minPct <=
          Math.abs(Number(val) * 100 / data.dataMatrix[i][kVal]) / 100) {

        validData += 1;
        source.push(srcDest[0]);
        target.push(srcDest[1]);
        value.push(Number(val));
        pct.push(Math.abs(Number(val) * 100 / data.dataMatrix[kVal]) / 100);
      }
    }
  }
  if (validData > 0) {
    keysKey = {
      'source': data.keys[kOrigDest],
      'target': data.keys[kOrigDest]
    };
    valueKey = {'value': data.keys[kVal]};
    return {
      'source': source,
      'target': target,
      'value': value,
      'pct': pct,
      'kKeys': keysKey,
      'kval': valueKey
    };
  } else {
    return 'INVALID_DATA';
  }
}

function getValuesForTwoKeys(data, minPercent, keysToShow, valueToShow) {
  if (valueToShow.value === 'count50'){
    var kVal = getIndex(data.keys, 'count');
  } else {
    var kVal = getIndex(data.keys, valueToShow.value || valueToShow);
  }
  var kOrig = getIndex(data.keys, keysToShow.source);
  var kDest = getIndex(data.keys, keysToShow.target);
  var i;
  var orig;
  var dest;
  var val;
  var source = [];
  var target = [];
  var value = [];
  var pct = [];
  var size = valueToShow === 'count50' ? 50 : data.dataMatrix.length;
  var validData = 0;
  var minPct = typeof minPercent == 'undefined' ? 0 : Number(minPercent) / 100;
  var keysKey;
  var valueKey;
  for (i = 0; i < size; i += 1) {
    orig = data.dataMatrix[i][kOrig];
    dest = data.dataMatrix[i][kDest];
    val = parseFloat(data.dataMatrix[i][kVal]);

    if (isValidValue(orig) && isValidValue(dest) && isFinite(val) &&
    Number(val) != 0 && data.dataMatrix.length > 0
    && minPct <= Math.abs(Number(val) * 100 /
    data.dataMatrix.length) / 100) {
      validData += 1;
      source.push(orig);
      target.push(dest);
      value.push(Number(val));
      pct.push(Math.abs(Number(val) * 100 / data.dataMatrix.length) / 100);
    }
  }
  if (validData > 0) {
    keysKey = {
      'source': data.keys[kOrig],
      'target': data.keys[kDest]
    };
    valueKey = {'value': data.keys[kVal]};
    return {
      'source': source,
      'target': target,
      'value': value,
      'pct': pct,
      'kKeys': keysKey,
      'kval': valueKey
    };
  } else {
    return 'INVALID_DATA';
  }
}
