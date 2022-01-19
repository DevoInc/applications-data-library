import { checkData, getkeyUniqueValues, getIndex } from '../utils/dataUtils';

export default (data, keyToShow, valToShow, grouping) => {

  var resData = [];
  if (checkData(data)) {
    let keyValues = getkeyUniqueValues(data, keyToShow);
    let keyIndex = getIndex(data.keys, keyToShow);
    let valIndex = getIndex(data.keys, valToShow);

    for (let keyValue of keyValues) {
      let obj = {};
      obj.measure = keyValue;
      obj.data = [];
      for (let i = 0, l = data.dataMatrix.length; i < l; i+=1) {
        if (data.dataMatrix[i][keyIndex] === obj.measure){
          obj.interval_s = parseInt(grouping) / 1000;
          obj.data.push([data.dataMatrix[i][0],
            parseInt(data.dataMatrix[i][valIndex])]);
        }
      }
      resData.push(obj);
    }
  }
  return resData;
};
