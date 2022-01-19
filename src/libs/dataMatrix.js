/**
 * @module libs/dataMatrix
 */

/**
 * Check the dataMatrix object
 * @return {Boolean} If the object is valid return true
 */
function check(obj) {
  return (
    obj &&
    Array.isArray(obj.dataMatrix) &&
    obj.dataMatrix.length > 0 &&
    Array.isArray(obj.keys)
  );
}

/**
 * Get the index of one key
 *
 * @param {Object} keys Keys of the DataMatrix
 * @param {String} key Wanted key
 * @returns Index of the key
 */
function getKeyIndex(keys, key) {
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].name === key) return i;
  }
  return null;
}

/**
 * Get the indexes of several keys
 *
 * @param {Object} keys Keys of the DataMatrix
 * @param {Array} wanted Array of wanted keys
 * @returns Array of indexes
 */
function getKeysIndexes(keys, wanted) {
  let idxs = [];
  for (let el of wanted) {
    let index = getKeyIndex(keys, el);
    if (index !== null) idxs.push(index);
  }
  return idxs;
}

export default {
  check,
  getKeyIndex,
  getKeysIndexes,
};
