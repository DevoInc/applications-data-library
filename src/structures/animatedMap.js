import { getkeyUniqueValues, getIndex } from '../utils/dataUtils';
import { GeolocatedKeys } from './googleMap';

export default (data, keys, value) => {
  let retData = null;
  let dates = getkeyUniqueValues(data, 'eventdate');
  let kVal = getIndex(data.keys, value.value || value);
  let geolocatedKeys = new GeolocatedKeys(data.keys,keys);
  let kLat = geolocatedKeys.latKey;
  let kLon = geolocatedKeys.lonKey;
  let arrAux = [];
  for(let date of dates){
    arrAux = arrAux.concat({
      period: date,
      values:[[], [], []]
    });
  }
  for (let elem of arrAux) {
    for (let item of data.dataMatrix) {
      if (elem.period === item[0]) {
        elem.values[0] = elem.values[0].concat(item[kLat]);
        elem.values[1] = elem.values[1].concat(item[kLon]);
        elem.values[2] = elem.values[2].concat(parseFloat(item[kVal]));
      }
    }
  }
  retData = arrAux;
  return retData;
};


// [
//   {
//     period:eventdate,
//     values:[
//       [latitudes],
//       [longitudes],
//       [count]
//     ]
//   }
// ]
