import { getRowsByKeys, getRowByKey, checkData } from '../utils/dataUtils';

import update from 'lodash/update';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export default function processFromPie(data, keys, value, allowsDecimals=false) {
  var serie = null;
  if(checkData(data)) {
    var grouppedData = {};
    var dataKeys = getRowsByKeys(data, keys);
    var dataValues = getRowByKey(data, value);
    dataKeys.forEach(function(dataKey) {
      dataKey.forEach(function(elem, index) {
        var name = '';
        name += elem;
        var newVal = allowsDecimals
                     ? parseFloat(dataValues[index])
                     : parseInt(dataValues[index]);
        update(grouppedData, [name], function(val) {
          return !val ? newVal : val + newVal;
        });
      });
    });
    serie = map(grouppedData, function(value, name) {
      return {name: name, y: value};
    });
    serie = sortBy(serie, function(elem) {return elem.y;}).reverse();

    // FIX: Convert the map to arrays because the PieWidget of washemo doesn't
    // currently order maps very well.
    serie = serie.map(function (value, index) {
      return [value.name, value.y]
    });
  }
  return serie;
}
