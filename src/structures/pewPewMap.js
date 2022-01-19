export default (data, keys, value, labels, color) => {
  let keysMap = data.keys.reduce((acc, val, idx) => {
    acc[val.name] = idx;
    return acc;
  }, {});

  let keysIdx = {
    from: {
      lat: keysMap[keys.from.lat],
      lon: keysMap[keys.from.lon]
    },
    to: {
      lat: keysMap[keys.to.lat],
      lon: keysMap[keys.to.lon]
    },
  };

  return data.dataMatrix.map(e => {
    return {
      "from": [e[keysIdx.from.lon], e[keysIdx.from.lat]],
      "to": [e[keysIdx.to.lon], e[keysIdx.to.lat]],
      "v": e[keysMap[value]],
      "c": color ? e[keysMap[color]] : null,
      "labels": labels ? [e[keysMap[labels.from]], e[keysMap[labels.to]]] : null
    }
  });
};
