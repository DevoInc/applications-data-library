import { getRowByKey, checkData } from '../utils/dataUtils';

export default (data, dateKey, valKey, name) => {
  let resData = {
    tags: [],
    days: [],
    values: []
  };
  let aux = null;
  if(checkData(data)) {
    dateKey = dateKey || 'eventdate';
    valKey = valKey || 'count';
    aux = convertToCalendar(data, dateKey, valKey, name);
    resData.tags.push(aux.tags);
    resData.days.push(aux.days);
    resData.values.push(aux.values);
  }
  return resData;
};

function convertToCalendar(data, dateKey, valKey, name) {
  let totData = data.dataMatrix.length;
  let days = [];
  let values = [];
  // let tags = [name];
  let datesRow = getRowByKey(data, dateKey);
  let keyRow = getRowByKey(data, valKey);
  let format = d3.time.format('%d-%m-%Y'); // Not working ???
  for (let i = 0; i < totData; i += 1) {
    days.push(format(moment(datesRow[i]).toDate()));
    values.push(convertToNum(keyRow[i]));
  }
  return {'tags': name, 'days': days, 'values': values};
}

function convertToNum(n) {
  return Number(parseFloat(n).toFixed(0));
}
