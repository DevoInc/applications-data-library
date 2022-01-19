import { getIndex, checkData } from '../utils/dataUtils';

export default (data, key, value, ranges) => {
  let result = [];
  let keysMap = data.keys.reduce((acc, val, idx) => {
    acc[val.name] = idx;
    return acc;
  }, {});

  let max = Math.max(...data.dataMatrix.reduce((acc, val) => {
    acc.push(val[keysMap[value]]); return acc; }, []));
  let longestTitle = 'aaaaaaaaaaaaaaa';
  data.dataMatrix.forEach(row => {
    let title = row[keysMap[key]];
    if (title.length > 30) title = title.slice(0, 27) + '...';
    if (title.length > longestTitle.length) longestTitle = title;
    let measure = row[keysMap[value]];
    result.push({
      "title": title,
      "ranges": ranges ? ranges : [max/3, 2*max/3, max * 1.1],
      "measures": [measure],
      "markers": [measure]
    });
  });

  return { result: result, longestTitle: longestTitle };
};
