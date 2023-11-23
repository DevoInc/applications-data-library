/**
 * The main goal is having a generic response from tufo, pitufo and malote.
 */

/**
 * Constructor for dataConversor.
 * @param {Object} response from server
 * @constructor
 */
export default function dataConversor(response) {
  let dataMatrix;

  // Serrea responses don't come with a success field
  if(response.type === dataConversor.TYPE_JSON  ||
      response.type === dataConversor.TYPE_JSON_COMPACT ||
      response.type === dataConversor.TYPE_JSON_SIMPLE_COMPACT ||
      response.type === dataConversor.TYPE_CSV) {
    response.success = true;
  }

  if (
    Object.keys(dataConversor.RESPONSE_TYPE).includes(response.type) &&
    check(response)
  ) {
    dataMatrix = getGenericData(response);
    if (checkData(response.object, response.type)) {
      Object.assign(dataMatrix,
        dataConversor.RESPONSE_TYPE[response.type](response.object));
    } else dataMatrix.object = [];
  } else console.warn('The response type is not valid.');
  return dataMatrix;
}

/**
 * Check the response structure
 * @param {object} response Response to check
 * @returns {boolean}
 */
function check(response) {
  return 'success' in response && 'status' in response && 'object' in response
    && 'msg' in response;
}

/**
 * Check the response data before process
 * @param {Array|Object} data Array of data
 * @param type type of data
 * @returns {boolean}
 */
function checkData(data, type) {
  // Serrea responses don't have an array but an object
  if(type === dataConversor.TYPE_JSON_COMPACT ||
    type === dataConversor.TYPE_JSON_SIMPLE_COMPACT) {
    return !(!data);
  } else {
    return !(!data || !Array.isArray(data) || data.length === 0);
  }
}

/**
 * Get generic data of the response
 * @param {object} response Response object
 * @return {object} Base of the dataMatrix format
 */
function getGenericData(response) {
  return {
    keys: [],
    dataMatrix: [],
    success: 'success' in response && !!response.success ? true : false,
    status: 'status' in response && !!response.status ? response.status : null,
    msg: 'msg' in response && !!response.msg ? response.msg : null,
    dates: response.dates
  };
}

dataConversor.TYPE_JSON_COMPACT = 'json/compact';
dataConversor.TYPE_JSON = 'json';
dataConversor.TYPE_CSV = 'csv';
dataConversor.TYPE_NONE = 'none';
dataConversor.TYPE_JSON_SIMPLE_COMPACT = 'json/simple/compact';

dataConversor.RESPONSE_TYPE = {
  'json': fromJson,
  'json/compact': fromJsonCompact,
  'json/simple/compact': fromJsonSimpleCompact,
  'csv': fromCsv,
  'none': fromNone
};

// Conversors
// -----------------------------------------------------------------------------

/**
 * Parse data from json format
 * {
 *   "success": true, //If response was ok or not.
 *   "status": 0, //Code to explain response status when error.
 *   "msg": null, //Message returned when an error happens.
 *   "object": [
 *     {'k11':'v11',...'k1n':'v1n'},
 *     ...
 *     {'kn1':'vn1',...'knn':'vnn'}
 *   ]
 * }
 * @param {Array} data Array of data
 */
function fromJson(data) {
  let keys = Object.keys(data[0]);
  return {
    keys: keys.length > 0 ? keys.map(createKey) : [],
    dataMatrix: data.map(line => {
      return keys.map(key => {
        return (key === 'eventdate') ?
          // HOTFIX: This wasn't working on firefox >= 46
          // (new Date(line[key] + '+00:00')).getTime() : line[key];
          new Date(line[key]).getTime() : line[key];
      });
    })
  };
}


/**
 * Parse data from Serrea json compact format
 * {
 *     "msg": "",
 *     "status": 0,
 *     "object": {
 *         "m": {
 *             "eventdate": {
 *                 "type": "timestamp",
 *                 "index": 0
 *             },
 *             "level": {
 *                 "type": "str",
 *                 "index": 1
 *             },
 *             "srcPort": {
 *                 "type": "int4",
 *                 "index": 2
 *             }
 *             ...
 *         },
 *         "d": [
 *             [1519989828006, "INFO", 51870],
 *             [1519989828392, "INFO", 51868],
 *             [1519989830837, "INFO", 55514]
 *             ...
 *         ]
 *     }
 * }
 *
 * @returns {Object}
 * @param data
 */
function fromJsonCompact(data) {
  // Transform the Serrea key format to the Vappulea one
  let key_entries = Object.entries(data.m);
  let keys = Array(key_entries.length);

  for(let index in key_entries) {
    const [key, body] = key_entries[index];
    keys[index] = {name: key, type: body.type};
  }
  return {
    keys: keys,
    dataMatrix: data.d
  };
}

function fromJsonSimpleCompact(data) {
  return fromJsonCompact(data);
}

/**
 * Parse data from Serrea json compact format
 * {
 *  "msg": "",
 *  "status": 0,
 *  "object": [csv string]
 * }
 * @returns {Object}
 * @param data
 */
function fromCsv (data) {
  var lines = data[0].split('\n');
  var dataMatrix = [];
  var keys =lines[0].split(',');
  for(var i=1;i<lines.length;i++){
    var currentline=lines[i].split(',');
	  dataMatrix.push(currentline);
  }
  return {
    keys: keys.map(createKey),
    dataMatrix
  };
}


/**
 * Don't parse data
 * @param {Array} data Array of data
 */
function fromNone(data) {
  return data;
}

// Conversors helpers
// -----------------------------------------------------------------------------

/**
 * Return the object width the field
 * @param {string} field Field title
 * @return {object}
 */
function createKey(name) {
  return { name, type: 'eventdate' === name ? 'epoch' : 'key' };
}
