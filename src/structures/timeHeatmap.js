import { checkData, getOneKeyIndex } from '../utils/dataUtils'

export default (data, value, showFirstEvent=true, showLastEvent=true,
  showZero=true) => {
  let regroupedData = null;
  if (checkData(data)) {
    regroupedData = regroupData(data, value);
    if (!showFirstEvent) {
      regroupedData = regroupedData.slice(1, regroupedData.length);
    }
    if (!showLastEvent) {
      regroupedData = regroupedData.slice(0, regroupedData.length - 1);
    }
    if (!showZero) {
      let regroupedDataNoZero = [];
      regroupedData.forEach(function (d) {
        if (d.count !== 0) {
          regroupedDataNoZero.push(d);
        }

      });
      regroupedData = regroupedDataNoZero;
    }
  } else {
    regroupedData = 'INVALID_COLUMN_NUMBER';
  }
  return regroupedData;
};

 function regroupData (data, value) {
  let regroupedData = [];
  let tsIndex = getOneKeyIndex(data.keys, 'eventdate');
  let valueIndex = getOneKeyIndex(data.keys, value);
  for (let i = 0; i < data.dataMatrix.length; i++) {
      let time = data.dataMatrix[i][tsIndex];
      if (regroupedData[time] === undefined) {
        regroupedData[time] = {};
      }
      if (regroupedData[time].count === undefined) {
        regroupedData[time].count = 0;
      }
      regroupedData[time].count += parseFloat(data.dataMatrix[i][valueIndex]);

  }

  let dataArray = [];
  for (let t in regroupedData) {
    regroupedData[t].time = Number(t);
    dataArray.push(regroupedData[t]);
  }


  dataArray.sort(function (a, b) {
    return a.time - b.time;
  });

  return dataArray;
};
