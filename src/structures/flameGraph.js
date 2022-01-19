import { checkData, getRowByKey } from '../utils/dataUtils';

export default (data, pathName, weightName) => {
  let retData = null;
  if (checkData(data)){
    let pathData = getRowByKey(data, pathName).filter(el => el);
    let weightData = getRowByKey(data, weightName).filter(el => el);

    if (pathData.length === weightData.length) {
      let parsedData = weightData.map( el  => parseFloat(el));
      retData = { path: pathData, weight: parsedData };
    } else {
      retData = { error: 'Wrong data' };
    }
  }
  return retData;
};
