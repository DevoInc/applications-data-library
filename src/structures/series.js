import dm from '@devo/applications-data-library/libs/dataMatrix';
import time from '@devo/applications-data-library/utils/time';

/**
 * Default function for parse dataMatrix to highchart series
 *
 * @param {Object} data DataMatrix object
 * @param {Object} opts Options object
 * @returns Data for highcharts
 */
export default (data, opts) => {
  // Check if data is OK
  if (!dm.check(data)) return returnNoData();

  // Default options
  opts = Object.assign(
    {
      keys: [],
      values: [],
      seriesNames: [], // Array of names for the series
      seriesProperties: null, // Array or Object of properties for the series
      forceFirstElement: true,
      forceLastElement: true,
      timestampKey: 'eventdate',
      order: null, // 'alphabetic' | 'total' | Custom function
      filter: null, // 10 | Custom function
      parseFunc: parseFloat,
      zeroFill: 'auto', // '1minute' | '6h' | '1d' | ... | Function
      zeroFillMidnight: null,
    },
    opts
  );

  if (typeof opts.keys === 'string') opts.keys = [opts.keys];
  if (typeof opts.values === 'string') opts.values = [opts.values];
  if (typeof opts.seriesNames === 'string')
    opts.seriesNames = [opts.seriesNames];

  // Change properties: forceFirstElement & forceLastElement to use directly
  opts.forceFirstElement = opts.forceFirstElement ? 0 : 1;
  opts.forceLastElement = opts.forceLastElement ? 0 : 1;

  let result = generateSeries(data, opts);

  // Process values for all series
  for (let serieKey in result)
    if (result.hasOwnProperty(serieKey))
      result[serieKey] = processValues(result[serieKey], data.dates, opts);

  // Process series and return
  return processSeries(result, opts);
};

// Series functions
// -----------------------------------------------------------------------------

/**
 * Generates one serie for each possible combination between
 * the unique values on the columns given by (setKeys) and the columns
 * given by setValToShow().
 *
 * For example given:
 *
 * setKeysToShow(['protocol', 'port']);
 * setValToShow(['count1', 'count2']);
 *
 * And:
 * unique values {UDP, TCP} in 'protocol' column
 * unique values {22, 23} in 'port' column
 *
 * The resulting series are:
 *
 * UDP_22_count1
 * UDP_23_count1
 * TCP_22_count1
 * TCP_23_count1
 * UDP_22_count2
 * UDP_23_count2
 * TCP_22_count2
 * TCP_23_count2
 *
 * @param data
 * @param opts
 */
function generateSeries(data, opts) {
  // index of timestamp
  let ts_idx = dm.getKeyIndex(data.keys, opts.timestampKey);

  // indices of each key
  let key_to_idx = new Map();
  for (let key of opts.keys)
    key_to_idx.set(key, dm.getKeyIndex(data.keys, key));

  // indices of each value
  let value_to_idx = new Map();
  for (let key of opts.values)
    value_to_idx.set(key, dm.getKeyIndex(data.keys, key));

  let result = {};
  // For each row add values to these series:
  // row[key1]_row[key2]_ ... row[keyN] (value1)
  // row[key1]_row[key2]_ ... row[keyN] (value2)
  // ...
  // row[key1]_row[key2]_ ... row[keyN] (valueN)
  // where key1..keyN are the keys given by setKeys() and value1..valueN
  // the columns given by setValToShow()
  for (let row of data.dataMatrix) {
    let ts = row[ts_idx];

    let key_values = [];
    for (let [key, value] of key_to_idx)
      key_values.push(row[key_to_idx.get(key)]);

    for (let [idx, value_key] of opts.values.entries()) {
      // SPECIAL CASE: If only one value column is specified
      // then we won't append the column name to the series. However if
      // there are more value columns we have to append their names so that
      // the user can distinguish between the series, for example:
      // UDP (count), TCP (avg)...
      let serieName = '';
      if (opts.values.length > 1) {
        serieName = buildSerieName(
          opts.seriesNames[idx],
          key_values,
          value_key
        );
      } else {
        serieName = buildSerieName(opts.seriesNames[idx], key_values);
      }

      result = addToSerie(
        result,
        {
          key: serieName,
          ts,
          val: row[value_to_idx.get(value_key)],
        },
        opts
      );
    }
  }

  return result;
}

/**
 * Gets a serie name taking into account the custom names defined
 * by the user, and the setKeys and setValToShow defined values
 *
 * @param customName    User defined name for the serie.
 * @param keys          columns on the data used to generate the
 *                      different series.
 * @param value         columns used for the Y values of the chart
 *                      (like counts etc..).
 * @returns {*}
 */
function buildSerieName(customName, keys, value) {
  // If a custom name was defined for the serie number idx, use it
  if (customName) {
    if (keys && keys.length > 0) {
      return keys.join('_') + ' (' + customName + ')';
    } else {
      return customName;
    }
    // Otherwise name it using the keys and the value
  } else {
    if (keys && keys.length > 0) {
      return keys.join('_') + (value === undefined ? '' : ' (' + value + ')');
    } else {
      return value;
    }
  }
}

/**
 * Add a value to the serie in the dataset
 *
 * @param {Object} result Result object
 * @param {Array} obj Object of params deconstructed in key, ts and val
 * @param {Object} opts Options object
 * @return Result object with the new value added
 */
function addToSerie(result, obj, opts) {
  // If the key value not exists yet in result create a new serie
  if (result[obj.key] === undefined) {
    result[obj.key] = {
      data: {}, // Data array
      name: obj.key, // Name of the serie
      total: 0, // Total of all values of the serie
    };

    if (opts.seriesProperties !== null) {
      if (Array.isArray(opts.seriesProperties)) {
        result[obj.key] = Object.assign(
          result[obj.key],
          opts.seriesProperties[0]
        );
        // Slice the array after assign the first
        if (opts.seriesProperties.length > 1) {
          opts.seriesProperties = opts.seriesProperties.slice(
            1,
            opts.seriesProperties.length
          );
        }
      } else if (typeof opts.seriesProperties === 'object') {
        result[obj.key] = Object.assign(
          result[obj.key],
          opts.seriesProperties[obj.key]
        );
      }
    }
  }

  if (result[obj.key].data[obj.ts] === undefined) {
    // If the timestamp not exists yet set the first value
    result[obj.key].data[obj.ts] = [obj.ts, opts.parseFunc(obj.val)];
  } else {
    // If the timestamp exists sum the value
    result[obj.key].data[obj.ts][1] += opts.parseFunc(obj.val);
  }

  // Add to totals
  result[obj.key].total += opts.parseFunc(obj.val);

  return result;
}

// Processing functions
// -----------------------------------------------------------------------------

/**
 * Process the values of the serie: zeroFill & slice
 *
 * @param {Object} serie Serie object
 * @param dates
 * @param {Object} opts Options object
 * @return Processed serie
 */
function processValues(serie, dates, opts) {
  // Turn data object into data array
  serie.data = Object.values(serie.data);
  // If zero filling is active
  if (opts.zeroFill) {
    serie = zeroFill(serie, dates, opts);
  }

  // Include or exclude first and last element
  if (serie.data.length > 1) {
    serie.data = serie.data.slice(
      opts.forceFirstElement,
      serie.data.length - opts.forceLastElement
    );
  }

  // Order elements by ts
  serie.data = serie.data.sort((a, b) => a[0] - b[0]);

  return serie;
}

/**
 * Creates a zero filled series between the start date and the end date.
 * Each zero in the serie is separated by an amount given by the zeroFill option.
 *
 * After this the serie coming from the backend is merged with the serie of
 * zeros. To do this we iterate over all the zeros and on each iteration
 * we try to merge as many data points as possible between one zero and
 * the next. 'Merging' means that the value of each data point is added
 * to the corresponding datapoint on the zeros serie. The timestamps from
 * the backend are discarded.
 *
 * TODO: check arguments.
 * TODO: check rare cases like series with one data point.
 *
 * @param serie
 * @param dates
 * @param opts
 * @returns {*}
 */
function zeroFill(serie, dates, opts) {
  // Get the zero fill periods
  if (typeof opts.zeroFill === 'function') {
    opts.zeroFill = opts.zeroFill(dates);
  }
  if (opts.zeroFill === 'auto') {
    opts.zeroFill = getLineGrouping(dates);
  }
  opts.zeroFillPeriods = time.genTimePeriods(
    dates.from,
    dates.to,
    opts.zeroFill,
    opts.zeroFillMidnight === null ? dates.from : opts.zeroFillMidnight
  );
  let data_idx = 0;
  let zero_idx = 0;
  let newData = [];

  // Discard the first data points if they are out of the client range
  while (
    serie.data[data_idx] !== undefined &&
    serie.data[data_idx][0] < opts.zeroFillPeriods[zero_idx]
  ) {
    data_idx++;
  }

  // Iterate over all the points on the zeros serie and add the values
  // from the data serie to the zeros when needed
  for (; zero_idx < opts.zeroFillPeriods.length - 1; zero_idx++) {
    let first = opts.zeroFillPeriods[zero_idx];
    let next = opts.zeroFillPeriods[zero_idx + 1];

    let data = 0;

    // Add the values of every datapoint found between the two zeros of
    // the current iteration
    while (
      serie.data[data_idx] !== undefined &&
      serie.data[data_idx][0] >= first &&
      serie.data[data_idx][0] < next
    ) {
      if (data_idx < serie.data.length) {
        data += serie.data[data_idx][1];
        data_idx++;
      }
    }

    newData.push([first, data]);
  }

  // Process data for the last zero. We only insert it if real data comes
  // from the backend at exactly that instant in time
  let data = 0;
  let lastZero = opts.zeroFillPeriods[opts.zeroFillPeriods.length - 1];
  let insertZero = false;
  while (data_idx < serie.data.length) {
    if (serie.data[data_idx][0] === lastZero) {
      data += serie.data[data_idx][1];
      insertZero = true;
    }
    data_idx++;
  }
  if (insertZero) newData.push([lastZero, data]);

  serie.data = newData;
  return serie;
}

/**
 * Process the series (Order and filter only util data)
 *
 * @param {Object} result Object with the results until now
 * @param {Object} opts Options object
 * @return Series array
 */
function processSeries(result, opts) {
  // Raw order & without filter
  result = Object.values(result);

  // Order
  if (opts.order === 'alphabetic') {
    // Order series by their names
    result = result.sort((a, b) => a.name - b.name);
  } else if (opts.order === 'total') {
    // Order series by their totals
    result = result.sort((a, b) => b.total - a.total);
  } else if (typeof opts.order === 'function') {
    // Order series by custom function
    result = result.sort(opts.order);
  }

  // Filter
  if (Number.isInteger(opts.filter)) {
    // Filter x series
    result = result.slice(0, opts.filter);
  } else if (typeof opts.filter === 'function') {
    // Filter by custom function
    result = opts.filter(result);
  }

  return result;
}

// Custom utils functions
// -----------------------------------------------------------------------------

/**
 * Default response on no data results
 * @return Response for no data
 */
function returnNoData() {
  return [{ name: 'NO DATA', data: [[0, 0]] }];
}

const getLineGrouping = (dates) => {
  let groupping = `1m`;
  const HOUR = 3600000;
  const DAY = 86400000;
  const WEEK = 7 * DAY;
  const diff = dates.to - dates.from;
  if (diff >= HOUR && diff < 4 * HOUR) {
    groupping = `5m`;
  } else if (diff >= 4 * HOUR && diff <= 12 * HOUR) {
    groupping = `15m`;
  } else if (diff > 12 * HOUR && diff < DAY) {
    groupping = `30m`;
  } else if (diff >= DAY && diff < WEEK) {
    groupping = `1h`;
  } else if (diff >= WEEK) {
    groupping = `1d`;
  }
  return groupping;
};
