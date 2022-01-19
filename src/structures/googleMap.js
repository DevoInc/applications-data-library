import { getGkLen, getIndex, isValidValue, getOneKeyIndex } from
  '../utils/dataUtils';

export default (data, keysToShow, valueToShow, partKey) => {
  var returnData;
  var gkLen;
  if (data.dataMatrix && typeof data != 'undefined' &&
  Array.isArray(data.dataMatrix) && data.dataMatrix.length > 0) {
    gkLen = getGkLen(data.keys);
    if (gkLen >= 1) {
      //1 Sola clave
      if (gkLen == 1) {
        returnData = getValuesForOneKeysMap(data, keysToShow);
      }
      //2 o mas Claves
      else {
        returnData = getValuesForTwoKeysMap(data, keysToShow, partKey,
          valueToShow);
      }
    } else {
      returnData = 'INVALID_COLUMN_NUMBER';
    }
  } else {
    returnData = 'NO_DATA';
  }
  return returnData;
};

function getValuesForOneKeyMap(data, keysToShow, value) {
  var kLatLon = getOneKeyIndex(data.keys, value.value || value);
  var i;
  var latlong;
  var val;
  var latArray = [];
  var lonArray = [];
  var valArray = [];
  var size = data.dataMatrix.length;
  var kVal = getIndex(data.keys, value.value || value);
  var validData = 0;
  var keysKey;
  var valueKey;
  for (i = 0; i < size; i += 1) {
    if (isValidValue(data.dataMatrix[i][kLatLon])) {
      latlong = [i].k[kLatLon].split(',');
      val = data - dataMatrix[i][kVal];
      if (Array.isArray(latlong) && latlong.length == 2 &&
        isFinite(latlong[0]) &&
        isFinite(latlong[1]) &&
        isFinite(val) &&
        Number(val) != 0) {

        validData += 1;
        latArray.push(Number(latlong[0]));
        lonArray.push(Number(latlong[1]));
        valArray.push(Number(val));
      }
    }
  }
  if (validData > 0) {
    keysKey = {
      'lat': data.dataMatrix[kLatLon],
      'long': data.dataMatrix[kLatLon]
    };
    valueKey = {'value': data.dataMatrix[kVal]};
    return {
      'lat': latArray,
      'lon': lonArray,
      'val': valArray,
      'kKeys': keysKey,
      'kval': valueKey
    };
  } else {
    return 'INVALID_DATA';
  }
}

function getValuesForTwoKeysMap (data, keysToShow, partKey, value) {
  var geolocatedKeys = new GeolocatedKeys(data.keys,keysToShow);
  var kLat = geolocatedKeys.latKey;
  var kLon = geolocatedKeys.lonKey;
  var i, lat, longg, val, latArray = [], lonArray = [], valArray = [];
  var size = data.dataMatrix.length;
  var kVal = getIndex(data.keys, value.value || value);
  var validData = 0;
  var keysKey;
  var valueKey;
  var partArray = partKey ? [] : null;
  var partAux;
  var partKeyIndex = partKey ? getIndex(data.keys, partKey) : null;
  for (i = 0; i < size; i += 1) {
    lat = data.dataMatrix[i][kLat];
    longg = data.dataMatrix[i][kLon];
    val = data.dataMatrix[i][kVal];
    partAux = partKey ? data.dataMatrix[i][partKeyIndex] : null;
    if (isValidValue(lat) && isValidValue(longg) &&
      isFinite(lat) && isFinite(longg) && isFinite(val) && Number(val) != 0) {
      validData += 1;
      latArray.push(Number(lat));
      lonArray.push(Number(longg));
      valArray.push(Number(val));
      if (partKey) {
        partArray.push(partAux);
      }
    }
  }
  if (validData > 0) {
    keysKey = {
      'lat': data.keys[kLat],
      'long': data.keys[kLon]
    };
    valueKey = {'value': data.dataMatrix[kVal]};
    return {
      'lat': latArray,
      'lon': lonArray,
      'val': valArray,
      'part': partArray,
      'kKeys': keysKey,
      'kval': valueKey
    };
  } else {
    return 'INVALID_DATA';
  }
}

export class GeolocatedKeys {
  constructor(dsKeys, presetKeys) {
    this.dsKeys = dsKeys.map((key) => key.name );
    this.presetKeys = presetKeys;
    this.latKey = this.getKeys(
      GeolocatedKeys.LATITUDE_KEY,
      GeolocatedKeys.DEFAULT_LATITUDE_KEY_INDEX,
      GeolocatedKeys.POSSIBLE_LATITUDE);
    this.lonKey = this.getKeys(
      GeolocatedKeys.LONGITUDE_KEY,
      GeolocatedKeys.DEFAULT_LONGITUDE_KEY_INDEX,
      GeolocatedKeys.POSSIBLE_LONGITUDE);
  }
  getKeys(key, defaultKeyIndex, possibleKeys) {
    var ret;
    var found = false;
    if (this.presetKeys
      && this.presetKeys[key]
      && getIndex(this.dsKeys, this.presetKeys[key]) >= 0) {

      ret = getIndex(this.dsKeys, this.presetKeys[key]);
    } else {
      for (var objkey of this.dsKeys) {
        found = possibleKeys.filter(function (el) {
            return objkey.toLowerCase().indexOf(el) >= 0;
          }).length > 0;

        ret = found ? this.dsKeys.indexOf(objkey) : defaultKeyIndex;
        if (found) break;
      }
    }
    return ret != null ? ret : defaultKeyIndex;
  }
}
GeolocatedKeys.DEFAULT_LATITUDE_KEY_INDEX = 1;
GeolocatedKeys.DEFAULT_LONGITUDE_KEY_INDEX = 2;
GeolocatedKeys.LATITUDE_KEY = 'lat';
GeolocatedKeys.LONGITUDE_KEY = 'long';
GeolocatedKeys.POSSIBLE_LATITUDE = ['lat','la','lt', 'lat_abs'];
GeolocatedKeys.POSSIBLE_LONGITUDE = ['lon','lo','ln','lg', 'lon_abs'];
