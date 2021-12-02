import {
  getGkLen,
  getOneKeyIndex,
  getIndex,
  getAllKeysIndex,
  checkData
} from '../utils/dataUtils';

export default (data, hierarchyChar, keysToShow, valueToShow) => {
  var returnData = 'NO_DATA';
  var gkLen = 0;
  if (checkData(data)) {
    gkLen = getGkLen;
    if (gkLen < 2) {
      returnData = 'INVALID_COLUMN_NUMBER';     
    } else {
      returnData = createPilayeredData(data, keysToShow, valueToShow);
    }
  } else {
    returnData = 'NO_DATA';
  }
  return returnData;
};

function createPilayeredData (data, keysToShow, valueToShow) {
  const cols = keysToShow.length + 1;
  const rows = data.dataMatrix.length;
  const valueIdx = getIndex(data.keys, valueToShow);
  const keysIdx = getAllKeysIndex(data.keys, keysToShow)
  let widgetData = new Array(cols);
  let i = cols;
  
  while(i--){
    widgetData[i] = new Array(rows);
  }
  
  i = rows;

  while(i--) {
    const row = data.dataMatrix[i];
    const v = row[valueIdx];
    let j = cols;
    while(j--){
      let keyIdx = keysIdx[j];
      widgetData[j][i] = row[keyIdx]
    }
    widgetData[cols-1][i] = v;
  }
  return widgetData;
  

}
