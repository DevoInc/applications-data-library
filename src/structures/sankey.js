import { getIndex } from '../utils/dataUtils';

export default (data, valKey, sourceKey, targetKey) => {
   var returnData;
   var gkLen;
   if (data  && typeof data != 'undefined' &&
    Array.isArray(data.dataMatrix) && data.dataMatrix.length > 0 &&
    Array.isArray(data.keys) && data.keys.length > 0) {
    gkLen = getIndex(data.keys, 'client') != -1 ? data.keys.length - 1 :
     data.keys.length;
    if (gkLen >= 2) {
      returnData = getValuesForMultipleKeys(data, valKey,
        sourceKey, targetKey);
    }
    else {
      returnData = 'INVALID_COLUMN_NUMBER';
    }
  }
  else {
    returnData = 'NO_DATA';
  }
  return returnData;
};

function getValuesForMultipleKeys(data, valKey, sourceKey, targetKey) {
  var sourceIndex = getIndex(data.keys, sourceKey);
  var targetIndex = getIndex(data.keys, targetKey);
  var valIndex = getIndex(data.keys, valKey);
  var dataParsed = {nodes: [], links: {source: [], target: [], value: []}};
  var iSource = null;
  var iTarget = null;
  data.dataMatrix.forEach(function (elem) {
    iSource = dataParsed.nodes.indexOf(elem[sourceIndex]);
    if (iSource < 0) {
      dataParsed.nodes.push(elem[sourceIndex]);
      iSource = dataParsed.nodes.length - 1;
    }
    iTarget = dataParsed.nodes.indexOf(elem[targetIndex]);
    if (iTarget < 0) {
      dataParsed.nodes.push(elem[targetIndex]);
      iTarget = dataParsed.nodes.length - 1;
    }
    dataParsed.links.source.push(iSource);
    dataParsed.links.target.push(iTarget);
    dataParsed.links.value.push(elem[valIndex]);
  });
  return dataParsed;
}
