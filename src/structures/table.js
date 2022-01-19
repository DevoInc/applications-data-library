import {
  getAllKeysIndex,
  getGkLen,
  getIndex,
  isValidValue
} from '../utils/dataUtils';

export default (data, cb, keysToShow, valueToshow, minPct, limit, sortAsc,
  drawNullNames) => {
  var returnData;
  var gkLen;
  if (typeof drawNullNames != 'undefined' && !drawNullNames) {
    var arrDelete = [];
    data.dataMatrix.forEach(function(data, index) {
      if (data && data.indexOf(null) >= 0) {
        arrDelete.push(index);
      }
    });
    /* Delete null series */
    data.dataMatrix = data.dataMatrix.filter(function(value, index) {
      return (arrDelete.indexOf(index) < 0);
    });
  }

  if (typeof data != 'undefined' && Array.isArray(data.dataMatrix) &&
    data.dataMatrix.length > 0) {
    gkLen = getGkLen(data.keys);
    if (gkLen >= 1) {
      returnData = getValues(data, keysToShow, valueToshow, minPct, limit);
    } else {
      returnData = 'INVALID_COLUMN_NUMBER';
    }
  } else {
    returnData = 'NO_DATA';
  }
  cb(null, returnData, data);

  function getValues(data, keysToShow, valueToshow, minPercent, limit) {
    var keys = getAllKeysIndex(data.keys, keysToShow, valueToshow);
    var i;
    var j;
    var totKeys = keys.length;
    var val;
    var name = [];
    var names = [];
    var value = [];
    var nameAux;
    var size = data.dataMatrix.length;
    var kVal = getIndex(data.keys, valueToshow.value);
    var labels = data.keys.filter((key) => key.name != 'client').map(
      (key) => key.name);
    var validData = 0;
    var pcts = [];
    var minPct = typeof minPercent == 'undefined' ? 0 :
      Number(minPercent) / 100;
    var absoluteSumTotal = 0;

    for (var i = data.dataMatrix.length - 1; i >= 0; i--) {
      absoluteSumTotal += parseFloat(data.dataMatrix[i][kVal]);
    }
    for (i = 0; i < size; i += 1) {
      name = [];
      for (j = 0; j < totKeys; j += 1) {
        nameAux = isValidValue(data.dataMatrix[i][keys[j]]) ?
          data.dataMatrix[i][keys[j]] : '';
        name.push(nameAux);
      }
      val = data.dataMatrix[i][kVal];
      if (isFinite(val) && absoluteSumTotal > 0 &&
        minPct <= Math.abs(Number(val) * 100 / absoluteSumTotal) / 100) {
        validData += 1;
        names.push(name);
        value.push(Number(val));
        pcts.push(Math.abs(Number(val) * 100 / absoluteSumTotal) / 100);
      }
    }
    if (validData > 0) {
      return {
        'labels': labels,
        'name': names,
        'count': value,
        'pct': pcts
      };
    } else {
      return 'INVALID_DATA';
    }
  }

  function getValueIndex(keys) {
    var containsAVG = keys.filter((element) => {
        return element.endsWith('_avg');
      }),
      isAvg = containsAVG.length > 0 ? true : false;
    if (isAvg) {
      return getIndex(containsAVG[0]);
    } else {
      return keys[Object.keys(keys)[0]];
    }
  }

};
