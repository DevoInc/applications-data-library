import {checkArray} from "../../../../src/utils/javascript/preconditions";

describe('Check Array', () => {

  test('Should correctly validate valid array', () => {
    let valid_array = ['asdf', 2, 'sdfsdf', 3];
    expect(checkArray(valid_array, ['string', 'number'])).toBe(true);
  });

  test('Should correctly validate emtpy array', () => {
    let valid_array = [];
    expect(checkArray(valid_array, ['string', 'number'])).toBe(true);
  });

  test('Should detect invalid types', () => {
    let valid_array = ['asdf', 2, 'sdfsdf', 3];
    expect(checkArray(valid_array, ['string'])).toBe(false);
  });

  test('A string is not an array', () => {
    let invalid_array = 'something_not_an_array';
    expect(checkArray(invalid_array)).toBe(false);
  });

});
