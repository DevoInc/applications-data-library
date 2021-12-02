import { checkData, getkeyUniqueValues, getIndex } from '../utils/dataUtils';

export default (data, keyToShow, valToShow) => {
  var returnData;
  if (checkData(data)) {
    returnData = [];
    let keyValues = getkeyUniqueValues(data, keyToShow);
    let keyIndex = getIndex(data.keys, keyToShow);
    let valueIndex = getIndex(data.keys, valToShow);
    for (let keyValue of keyValues) {
      let obj = {};
      obj.name = keyValue;
      obj.articles = [];
      for (let i = 0, l = data.dataMatrix.length; i < l; i+=1) {
        if (data.dataMatrix[i][keyIndex] == obj.name){
          obj.articles.push([data.dataMatrix[i][0],
            parseInt(data.dataMatrix[i][valueIndex])]);
        }
      }
      returnData.push(obj);
    }
  } else {
    returnData = 'INVALID_COLUMN_NUMBER';
  }
  return returnData;
};
