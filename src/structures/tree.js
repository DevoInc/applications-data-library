import dm from '@devo/applications-data-library/libs/dataMatrix';

export default (data, keys, value) => {
  var ret = {
    data: [],
    kKeys: {
      keys: keys,
    },
    kval: {
      value: value,
    },
  };
  if (dm.check(data)) {
    // Get the indexes of the keys
    let wanted = keys.slice(0);
    wanted.push(value);
    let idxs = dm.getKeysIndexes(data.keys, wanted);

    // Iterate over the rows of the data
    for (let row of data.dataMatrix) {
      let res = [];
      // Iterate over the items of the row
      for (let i = 0; i < row.length; i++) {
        // Only add to result when the index of the row match the
        // indexes of keys
        if (idxs.includes(i)) res.push(row[i]);
      }
      // Add the result to the data
      ret.data.push(res);
    }
  }
  // Sort?
  ret.data = ret.data.sort((elem, nextElem) => elem[-1] < nextElem[-1]);
  return ret;
};
