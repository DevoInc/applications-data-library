/*
  Preconditions helpers, useful to validate arguments to functions
*/

/**
 * Checks that an array is an array and contains the correct types.
 * Useful to verify small arrays.
 * @param array
 * @param types
 * @returns {boolean}
 */
export function checkArray(array, types = []) {
  let correct = true;
  correct = correct &&  Array.isArray(array);
  correct = correct && array.every(obj => {
    return types.some(_type => {
      return checkType(obj, _type);
    });
  });
  return correct;
}

export function checkType(input, type) {
  if (typeof type === 'string') {
    return typeof input === type;
  } else {
    return input instanceof type;
  }
}
