import { checkData, getOneKeyIndex } from '../utils/dataUtils';

export default (data, value,lastIndex) => {

  let res = {};
  if (checkData(data)){
    let avg = 0;
    let valueArr = [];
    let valueIndex = getOneKeyIndex(data.keys, value);
    let idx = isFinite(lastIndex) ? parseInt(lastIndex) : 0;
    for (let i = 0, l = data.dataMatrix.length - idx; i < l; i+=1) {
      avg += parseFloat(data.dataMatrix[i][valueIndex]);
      valueArr = valueArr.concat(parseFloat(data.dataMatrix[i][valueIndex]));
    }
    try {
      res.avg = avg / valueArr.length;
      res.v = valueArr[valueArr.length -1];
      res.maximun = Math.max.apply(Math, valueArr);
      res.minimun = Math.min.apply(Math, valueArr);
    } catch(err) {
      console.error('GaugeWidget: too much data to be displayed');
      res = 'TOO MUCH DATA';
    }
    return res;
  }
};
