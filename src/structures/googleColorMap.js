import { checkData, getIndex } from '../utils/dataUtils';
import dependencies from '../utils/dependencies';

const AllCountryCodeByCode = dependencies.require('util').AllCountryCodeByCode;

export default function processFromColorMap(data, keyToShow, valueToShow) {
  let returnData = 'NO_DATA';
  if (checkData(data)) {
    var kCountry = getIndex(data.keys, keyToShow);
    var kVal = getIndex(data.keys, valueToShow);
    var size = data.dataMatrix.length;
    var countries = AllCountryCodeByCode();
    var validData = 0;
    var min = Infinity;
    var max = -Infinity;
    for (let i = 0; i < size; i += 1) {
      let country = data.dataMatrix[i][kCountry];
      let val = Number(data.dataMatrix[i][kVal]);

      if (val && val != 0) {
        validData += 1;
        if (countries[country]) {
          min = min > val ? val : min;
          max = max < val ? val : max;
          countries[country].value = val;
        } else {
          console.log('Country not found: ' + country);
        }
      }
    }
  }

  if (validData > 0) {
    let keysKey = { country: kCountry };
    let valueKey = { value: kVal };
    return {
      country: countries,
      min: min,
      max: max,
      totalData: validData,
      kKeys: keysKey,
      kval: valueKey,
    };
  }
  return returnData;
}
