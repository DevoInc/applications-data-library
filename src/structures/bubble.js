import { getIndex, checkData } from '../utils/dataUtils';

export default (data, xAxis, yAxis, value, seriesby) => {

  let ret = {
    data: {
      allPeriods: [[], [], []],
      byPeriod: [{period: '', values: []}]
    },
    metadata: {fields: [], realtime: false}
  };
  if (checkData(data)) {
    /* Set metadata */
    ret.metadata.fields.push({ name: xAxis.name, type: { name: xAxis.type } });
    ret.metadata.fields.push({ name: yAxis.name, type: { name: yAxis.type } });
    ret.metadata.fields.push({ name: value, type: { name: 'int' } });
    if (seriesby) {
      ret.metadata.fields.push({name: seriesby, type: {name: 'str'}});
      ret.data.allPeriods.push([]);
    }

    /* Transform data */
    let xKeyIndex = getIndex(data.keys, xAxis.name);
    let yKeyIndex = getIndex(data.keys, yAxis.name);
    let sbyKeyIndex = null;
    if (seriesby) {
      sbyKeyIndex = getIndex(data.keys, seriesby);
    }
    let valueIndex = getIndex(data.keys, value);
    for(let elem of data.dataMatrix) {
      let xValue = xAxis.type == 'str' ? elem[xKeyIndex] :
        parseFloat(elem[xKeyIndex]);
      let yValue = yAxis.type == 'str' ? elem[yKeyIndex] :
        parseFloat(elem[yKeyIndex]);
      ret.data.allPeriods[0].push(xValue);
      ret.data.allPeriods[1].push(yValue);
      ret.data.allPeriods[2].push(parseFloat(elem[valueIndex]));
      if (seriesby) {
        ret.data.allPeriods[3].push(elem[sbyKeyIndex]);
      }
    }
    ret.data.byPeriod[0].values = ret.data.allPeriods;
  }
  return ret;
};
