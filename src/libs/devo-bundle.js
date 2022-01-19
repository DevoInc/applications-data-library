(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = 'function' == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = 'MODULE_NOT_FOUND'), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = 'function' == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        (function (global) {
          'use strict';

          global.devo = {
            client: require('../lib/client.js').create,
          };
        }.call(
          this,
          typeof global !== 'undefined'
            ? global
            : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
            ? window
            : {}
        ));
      },
      { '../lib/client.js': 2 },
    ],
    2: [
      function (require, module, exports) {
        'use strict';

        const helper = require('@devo/js-helper');
        const download = require('./download.js');
        const oboeRequest = require('./oboeRequest.js');
        const fetchRequest = require('./fetchRequest.js');

        /**
         * Devo client.
         */
        class Client {
          /**
           * Create the client.
           * @param {Object} credentials User credentials.
           */
          constructor(credentials) {
            this._config = helper.config.create(credentials);
            this._fetchRequest = fetchRequest.create();
          }

          /**
           * Send a query request to the API.
           *
           * @param {Object} options Configuration values.
           * @returns {Object} a promise with the resulting JSON.
           */
          query(options) {
            const opc = this._config.parseQuery(options);
            if (!helper.config.validate(opc)) {
              return Promise.reject('Invalid options');
            }
            return this._fetchRequest
              .post(opc)
              .then(fetchRequest.parseResponse);
          }

          /**
           * Make a streaming query call to the API.
           *
           * @param {Object} options Configuration values.
           * @param {Object} callbacks An object with attributes for callbacks:
           *  - meta: Function to send headers.
           *  - data: Function to send each row of data.
           *  - error: Function to send any errors.
           *  - done: optional, invoked after finishing parsing.
           */
          stream(options, callbacks) {
            const opc = this._config.parseQuery(
              options,
              oboeRequest.STREAMING_FORMAT
            );
            if (!helper.config.validate(opc)) {
              return callbacks.error('Invalid options');
            }
            return oboeRequest.create(opc).stream(opc, callbacks);
          }

          /**
           * Download a file from the API.
           * Helper function to make a query and send the result to the browser.
           *
           * @param {Object} options Configuration values including:
           * @returns {Object} A promise with the possible error.
           */
          download(options) {
            const opc = this._config.parseQuery(options);
            if (!helper.config.validate(opc)) {
              return Promise.reject('Invalid options');
            }
            return this._fetchRequest
              .post(opc)
              .then((response) => response.blob())
              .then(download.sendFileToNav);
          }

          /**
           * Get the list of tasks.
           *
           * @returns {Object} A promise with the list.
           */
          getTasks() {
            return this._get(helper.taskPaths.getTasks());
          }

          /**
           * Get a list of tasks by type.
           *
           * @param {String} type Type of the desired tasks.
           * @returns {Object} A promise with the list.
           */
          getTasksByType(type) {
            return this._get(helper.taskPaths.getTasksByType(type));
          }

          /**
           * Get info for an existing task.
           *
           * @param {String} taskId ID of the task.
           * @returns {Object} A promise with the info.
           */
          getTaskInfo(taskId) {
            return this._get(helper.taskPaths.getTaskInfo(taskId));
          }

          /**
           * Start an existing task.
           *
           * @param {String} taskId ID of the task.
           * @returns {Object} A promise with the result.
           */
          startTask(taskId) {
            return this._get(helper.taskPaths.startTask(taskId));
          }

          /**
           * Stop an existing task.
           *
           * @param {String} taskId ID of the task.
           * @returns {Object} A promise with the result.
           */
          stopTask(taskId) {
            return this._get(helper.taskPaths.stopTask(taskId));
          }

          /**
           * Delete an existing task.
           *
           * @param {String} taskId ID of the task.
           * @returns {Object} A promise with the result.
           */
          deleteTask(taskId) {
            return this._get(helper.taskPaths.deleteTask(taskId));
          }

          _get(path) {
            const opc = this._config.parseGet(path);
            return this._fetchRequest.get(opc).then(fetchRequest.parseResponse);
          }
        }

        exports.create = (credentials) => new Client(credentials);
      },
      {
        './download.js': 3,
        './fetchRequest.js': 4,
        './oboeRequest.js': 5,
        '@devo/js-helper': 6,
      },
    ],
    3: [
      function (require, module, exports) {
        'use strict';

        const DOWNLOAD_FILE_NAME = 'download';

        /**
         * Generate an "a" element to send a new file download event to navigator
         * @param {Object} blob
         * @private
         */
        exports.sendFileToNav = function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download =
            DOWNLOAD_FILE_NAME +
            '-' +
            new Date().toISOString() +
            _getFileExt(blob.type);
          a.click();
        };

        /**
         * Return a file extension depending content type of content
         * @param {String} type
         * @returns {String}
         * @private
         */
        function _getFileExt(type) {
          //console.log('type %s', type)
          switch (type) {
            case 'text/xlsx':
              return '.xlsx';
            case 'text/tab-separated-values':
              return '.tsv';
            case 'text/csv':
              return '.csv';
            case 'application/msgpack':
              return '.msgpack.json';
            case 'text/plain':
              return '.raw.txt';
            default:
              return '.json';
          }
        }
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        'use strict';

        module.exports = {
          create: (options) => new FetchRequest(options),
          parseResponse,
        };

        /**
         * Send requests using fetch.
         */
        class FetchRequest {
          constructor() {}

          /**
           * Make a POST API call using fetch.
           *
           * @param {Object} options Contains url, headers and body.
           * @returns {Object} A promise with either JSON or text.
           * HTTP status codes other than 2xx are returned as rejected promises.
           */
          post(options) {
            return fetch(options.url, {
              method: 'POST',
              credentials: 'include',
              mode: 'cors',
              headers: options.headers,
              body: JSON.stringify(options.body),
            }).then(this._status);
          }

          /**
           * Make a GET API call using fetch.
           *
           * @param {Object} options Contains url and headers.
           * @returns {Object} A promise with either JSON or text.
           * HTTP status codes other than 2xx are returned as rejected promises.
           */
          get(options) {
            return fetch(options.url, {
              method: 'GET',
              credentials: 'include',
              mode: 'cors',
              headers: options.headers,
            }).then(this._status);
          }

          /**
           * Validate ajax call status
           * @param {Object} response
           * @returns {Object}
           * @private
           */
          _status(response) {
            if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              throw new Error(response.statusText);
            }
          }
        }

        function parseResponse(response) {
          const contentType = response.headers.get('content-type');
          if (contentType.indexOf('json') !== -1) {
            return response.json();
          }
          return response.text();
        }
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        'use strict';

        const oboe = require('oboe');

        module.exports = {
          create: (options) => new OboeRequest(options),
          STREAMING_FORMAT: 'json/compact',
        };

        /**
         * Send a request to the Devo API server using the Oboe library.
         */
        class OboeRequest {
          constructor() {
            this._columns = null;
            this._failed = false;
            this._msg = null;
          }

          /**
           * Make a streaming query to the Devo API.
           *
           * @param {Object} options An object with method, body and headers.
           * @param {Object} callbacks An object with attributes for callbacks:
           *  - meta: receives headers.
           *  - data: receives each row of data.
           *  - error: receives any errors.
           *  - done: optional, invoked after finishing parsing.
           */
          stream(options, callbacks) {
            this._request = oboe({
              method: options.method,
              withCredentials: true,
              url: options.url,
              headers: options.headers,
              body: JSON.stringify(options.body),
            });
            this._request.on('fail', (error) =>
              callbacks.error(error.thrown || error)
            );
            this._request.on('done', () => {
              if (this._done) return;
              this._done = true;
              if (this._failed) {
                callbacks.error && callbacks.error(this._msg);
              } else {
                callbacks.done && callbacks.done();
              }
            });
            this._request.node(this._getNodes(callbacks));

            return this;
          }

          /**
           * Abort an ongoing request.
           */
          abort() {
            this._request.abort();
            return this;
          }

          /**
           * Create the node configuration to manage all events types.
           *
           * @param {Object} callbacks An object with attributes for callbacks:
           *  - meta: receives headers.
           *  - data: receives each row of data.
           *  - error: receives any errors.
           *  - done: invoked after finishing parsing.
           * @returns an object that can be passed to oboe().node().
           * @private
           */
          _getNodes(callbacks) {
            return {
              '!.msg': (msg) => {
                this._msg = msg;
              },
              '!.object.d[*]': (data) => this._readRow(data, callbacks.data),
              '!.object.m': (meta) => this._readMeta(meta, callbacks.meta),
              '!.e': (error) => {
                if (this._done) return;
                callbacks.error(error);
                this._done = true;
              },
              '!.status': (code) => {
                if (code === 0 || code === 200) return;
                this._failed = true;
              },
            };
          }

          /**
           * Read meta data.
           *
           * @param {Object} event Meta event.
           * @param {function(*)} callback Optional function to send the event.
           * @private
           */
          _readMeta(event, callback) {
            this._columns = Object.keys(event);
            if (callback) {
              callback(event);
            }
            return oboe.drop;
          }

          /**
           * Read a data event, return an object with a single row.
           */
          _readRow(event, callback) {
            const data = {};
            this._columns.forEach((key, index) => (data[key] = event[index]));
            if (callback) {
              callback(data);
            }
            return oboe.drop;
          }
        }
      },
      { oboe: 13 },
    ],
    6: [
      function (require, module, exports) {
        'use strict';

        module.exports = {
          taskPaths: require('./lib/taskPaths.js'),
          config: require('./lib/config.js'),
        };
      },
      { './lib/config.js': 7, './lib/taskPaths.js': 8 },
    ],
    7: [
      function (require, module, exports) {
        'use strict';

        const HmacSHA256 = require('crypto-js/hmac-sha256');

        const PATH_QUERY = '/query';

        module.exports = {
          create: (credentials) => new Config(credentials),
          validate,
        };

        /**
         * Class to manage config values.
         */
        class Config {
          /**
           * Create the config.
           * @param {Object} credentials Configuration object including:
           *  - url: server URL.
           *  - apiToken: used for authorization.
           *  - token: equivalent to apiToken, deprecated.
           *  - apiKey: used for authorization. Requires apiSecret.
           *  - apiSecret: used to sign the request. Requires apiKey.
           */
          constructor(credentials) {
            this._mustSign = false;
            if (credentials.url && credentials.url.endsWith('/')) {
              this._url = credentials.url.substring(
                0,
                credentials.url.length - 1
              );
            } else {
              this._url = credentials.url;
            }
            if (credentials.apiToken || credentials.token) {
              this._apiToken = credentials.apiToken || credentials.token;
            } else if (credentials.apiKey) {
              this._mustSign = true;
              this._apiKey = credentials.apiKey;
              this._apiSecret = credentials.apiSecret;
            }
          }

          /**
           * Parse a set of options for a query invocation.
           *
           * @param {Object} the options object, including:
           *  - path: path for the endpoint. Default is '/query'.
           *  - method: HTTP method. Default is 'POST'.
           *  - format: response format, can be one of: json, msgpack, xls, csv, tsv
           *  or raw.
           *    Default is 'json'.
           *  - dateFrom: starting date in ISO-8601 format, default current date.
           *  - dateTo: ending date in ISO-8601 format, optional.
           *  - skip: elements of the query to skip, optional.
           *  - limit: elements of the query to return, optional.
           *  - query: string with query to send.
           *  - queryId: alternatively identifies a particular query in the server.
           *  - destination: optional destination for the data.
           * @param format optionally the format to use, has precedence on
           * options.format.
           * @return an object with parsed url, body and headers.
           */
          parseQuery(options, format) {
            const opc = {
              url: this._url + (options.path || PATH_QUERY),
              method: options.method || 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: {
                from: getDate(options.dateFrom || new Date()),
                mode: {
                  type: format || options.format || 'json',
                },
              },
            };
            const to = getDate(options.dateTo);
            if (to) opc.body.to = to;
            if (options.skip) opc.body.skip = options.skip;
            if (options.limit) opc.body.limit = options.limit;
            if (options.query) {
              opc.body.query = options.query;
            } else {
              opc.body.queryId = options.queryId;
            }
            if (options.destination) {
              opc.body.destination = {
                type: options.destination.type,
                params: options.destination.params,
              };
            }
            this._generateSignature(opc);
            return opc;
          }

          /**
           * Parse a set of options for a GET invocation.
           *
           * @param {String} path Path for the endpoint.
           * @return an object with parsed url and headers.
           */
          parseGet(path) {
            const opc = {
              url: this._url + path,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            };
            this._generateSignature(opc);
            return opc;
          }

          /**
           * Create apiKey&apiSecret signature using body parameters,
           * or just add apiToken to headers.
           */
          _generateSignature(opc) {
            if (this._apiToken) {
              opc.headers.Authorization = `${this._apiToken}`;
            }
            if (this._mustSign) {
              let timestamp = new Date().getTime();
              opc.headers['x-logtrust-apikey'] = this._apiKey;
              opc.headers['x-logtrust-timestamp'] = timestamp;
              const body = opc.body ? JSON.stringify(opc.body) : '';
              const signMsg = this._apiKey + body + timestamp;
              opc.headers['x-logtrust-sign'] = HmacSHA256(
                signMsg,
                this._apiSecret
              ).toString();
            }
          }
        }

        /**
         * Validate if generated options object is OK.
         * @returns {boolean}
         */
        function validate(opc) {
          if (opc.url.startsWith('undefined')) {
            console.error('Invalid URL');
            return false;
          }
          if (!opc.body) {
            console.error('No body');
            return false;
          }
          const headers = opc.headers;
          if (!headers['x-logtrust-apikey'] && !headers.Authorization) {
            console.error('No authorization');
            return false;
          }
          if (!opc.body.queryId && !opc.body.query) {
            console.error('Missing query or query ID');
            return false;
          }
          if (!opc.body.from) {
            console.error('Missing "from" date; please use ISO-8601 format');
            return false;
          }
          return true;
        }

        /**
         * Returns a date for API payload
         * @param date
         * @returns {*}
         */
        function getDate(date) {
          //Infinite Query (Not set date)
          if (!date || date === -1 || date === '-1') {
            return null;
          } else {
            return parseDateToEpoch(date);
          }
        }

        /**
         * Converts a date into epoch (milliseconds)
         * @param date
         * @returns {number}
         */
        function parseDateToEpoch(date) {
          return parseInt(new Date(date).getTime() / 1000);
        }
      },
      { 'crypto-js/hmac-sha256': 10 },
    ],
    8: [
      function (require, module, exports) {
        'use strict';

        const PATH_TASKS = '/jobs';
        const PATH_TASK = '/job/';
        const PATH_TASK_STOP = PATH_TASK + 'stop/';
        const PATH_TASK_START = PATH_TASK + 'start/';
        const PATH_TASK_REMOVE = PATH_TASK + 'remove/';

        module.exports = {
          getTasks: () => PATH_TASKS,
          getTasksByType: (type) => PATH_TASKS + '/' + type,
          getTaskInfo: (taskId) => PATH_TASK + taskId,
          startTask: (taskId) => PATH_TASK_START + taskId,
          stopTask: (taskId) => PATH_TASK_STOP + taskId,
          deleteTask: (taskId) => PATH_TASK_REMOVE + taskId,
        };
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        (function (root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory();
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define([], factory);
          } else {
            // Global (browser)
            root.CryptoJS = factory();
          }
        })(this, function () {
          /**
           * CryptoJS core components.
           */
          var CryptoJS =
            CryptoJS ||
            (function (Math, undefined) {
              /*
               * Local polyfil of Object.create
               */
              var create =
                Object.create ||
                (function () {
                  function F() {}

                  return function (obj) {
                    var subtype;

                    F.prototype = obj;

                    subtype = new F();

                    F.prototype = null;

                    return subtype;
                  };
                })();

              /**
               * CryptoJS namespace.
               */
              var C = {};

              /**
               * Library namespace.
               */
              var C_lib = (C.lib = {});

              /**
               * Base object for prototypal inheritance.
               */
              var Base = (C_lib.Base = (function () {
                return {
                  /**
                   * Creates a new object that inherits from this object.
                   *
                   * @param {Object} overrides Properties to copy into the new object.
                   *
                   * @return {Object} The new object.
                   *
                   * @static
                   *
                   * @example
                   *
                   *     var MyType = CryptoJS.lib.Base.extend({
                   *         field: 'value',
                   *
                   *         method: function () {
                   *         }
                   *     });
                   */
                  extend: function (overrides) {
                    // Spawn
                    var subtype = create(this);

                    // Augment
                    if (overrides) {
                      subtype.mixIn(overrides);
                    }

                    // Create default initializer
                    if (
                      !subtype.hasOwnProperty('init') ||
                      this.init === subtype.init
                    ) {
                      subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                      };
                    }

                    // Initializer's prototype is the subtype object
                    subtype.init.prototype = subtype;

                    // Reference supertype
                    subtype.$super = this;

                    return subtype;
                  },

                  /**
                   * Extends this object and runs the init method.
                   * Arguments to create() will be passed to init().
                   *
                   * @return {Object} The new object.
                   *
                   * @static
                   *
                   * @example
                   *
                   *     var instance = MyType.create();
                   */
                  create: function () {
                    var instance = this.extend();
                    instance.init.apply(instance, arguments);

                    return instance;
                  },

                  /**
                   * Initializes a newly created object.
                   * Override this method to add some logic when your objects are created.
                   *
                   * @example
                   *
                   *     var MyType = CryptoJS.lib.Base.extend({
                   *         init: function () {
                   *             // ...
                   *         }
                   *     });
                   */
                  init: function () {},

                  /**
                   * Copies properties into this object.
                   *
                   * @param {Object} properties The properties to mix in.
                   *
                   * @example
                   *
                   *     MyType.mixIn({
                   *         field: 'value'
                   *     });
                   */
                  mixIn: function (properties) {
                    for (var propertyName in properties) {
                      if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                      }
                    }

                    // IE won't copy toString using the loop above
                    if (properties.hasOwnProperty('toString')) {
                      this.toString = properties.toString;
                    }
                  },

                  /**
                   * Creates a copy of this object.
                   *
                   * @return {Object} The clone.
                   *
                   * @example
                   *
                   *     var clone = instance.clone();
                   */
                  clone: function () {
                    return this.init.prototype.extend(this);
                  },
                };
              })());

              /**
               * An array of 32-bit words.
               *
               * @property {Array} words The array of 32-bit words.
               * @property {number} sigBytes The number of significant bytes in this word array.
               */
              var WordArray = (C_lib.WordArray = Base.extend({
                /**
                 * Initializes a newly created word array.
                 *
                 * @param {Array} words (Optional) An array of 32-bit words.
                 * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.create();
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
                 */
                init: function (words, sigBytes) {
                  words = this.words = words || [];

                  if (sigBytes != undefined) {
                    this.sigBytes = sigBytes;
                  } else {
                    this.sigBytes = words.length * 4;
                  }
                },

                /**
                 * Converts this word array to a string.
                 *
                 * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
                 *
                 * @return {string} The stringified word array.
                 *
                 * @example
                 *
                 *     var string = wordArray + '';
                 *     var string = wordArray.toString();
                 *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                 */
                toString: function (encoder) {
                  return (encoder || Hex).stringify(this);
                },

                /**
                 * Concatenates a word array to this word array.
                 *
                 * @param {WordArray} wordArray The word array to append.
                 *
                 * @return {WordArray} This word array.
                 *
                 * @example
                 *
                 *     wordArray1.concat(wordArray2);
                 */
                concat: function (wordArray) {
                  // Shortcuts
                  var thisWords = this.words;
                  var thatWords = wordArray.words;
                  var thisSigBytes = this.sigBytes;
                  var thatSigBytes = wordArray.sigBytes;

                  // Clamp excess bits
                  this.clamp();

                  // Concat
                  if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for (var i = 0; i < thatSigBytes; i++) {
                      var thatByte =
                        (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                      thisWords[(thisSigBytes + i) >>> 2] |=
                        thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                    }
                  } else {
                    // Copy one word at a time
                    for (var i = 0; i < thatSigBytes; i += 4) {
                      thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                    }
                  }
                  this.sigBytes += thatSigBytes;

                  // Chainable
                  return this;
                },

                /**
                 * Removes insignificant bits.
                 *
                 * @example
                 *
                 *     wordArray.clamp();
                 */
                clamp: function () {
                  // Shortcuts
                  var words = this.words;
                  var sigBytes = this.sigBytes;

                  // Clamp
                  words[sigBytes >>> 2] &=
                    0xffffffff << (32 - (sigBytes % 4) * 8);
                  words.length = Math.ceil(sigBytes / 4);
                },

                /**
                 * Creates a copy of this word array.
                 *
                 * @return {WordArray} The clone.
                 *
                 * @example
                 *
                 *     var clone = wordArray.clone();
                 */
                clone: function () {
                  var clone = Base.clone.call(this);
                  clone.words = this.words.slice(0);

                  return clone;
                },

                /**
                 * Creates a word array filled with random bytes.
                 *
                 * @param {number} nBytes The number of random bytes to generate.
                 *
                 * @return {WordArray} The random word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.random(16);
                 */
                random: function (nBytes) {
                  var words = [];

                  var r = function (m_w) {
                    var m_w = m_w;
                    var m_z = 0x3ade68b1;
                    var mask = 0xffffffff;

                    return function () {
                      m_z = (0x9069 * (m_z & 0xffff) + (m_z >> 0x10)) & mask;
                      m_w = (0x4650 * (m_w & 0xffff) + (m_w >> 0x10)) & mask;
                      var result = ((m_z << 0x10) + m_w) & mask;
                      result /= 0x100000000;
                      result += 0.5;
                      return result * (Math.random() > 0.5 ? 1 : -1);
                    };
                  };

                  for (var i = 0, rcache; i < nBytes; i += 4) {
                    var _r = r((rcache || Math.random()) * 0x100000000);

                    rcache = _r() * 0x3ade67b7;
                    words.push((_r() * 0x100000000) | 0);
                  }

                  return new WordArray.init(words, nBytes);
                },
              }));

              /**
               * Encoder namespace.
               */
              var C_enc = (C.enc = {});

              /**
               * Hex encoding strategy.
               */
              var Hex = (C_enc.Hex = {
                /**
                 * Converts a word array to a hex string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The hex string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                  // Shortcuts
                  var words = wordArray.words;
                  var sigBytes = wordArray.sigBytes;

                  // Convert
                  var hexChars = [];
                  for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                  }

                  return hexChars.join('');
                },

                /**
                 * Converts a hex string to a word array.
                 *
                 * @param {string} hexStr The hex string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                 */
                parse: function (hexStr) {
                  // Shortcut
                  var hexStrLength = hexStr.length;

                  // Convert
                  var words = [];
                  for (var i = 0; i < hexStrLength; i += 2) {
                    words[i >>> 3] |=
                      parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                  }

                  return new WordArray.init(words, hexStrLength / 2);
                },
              });

              /**
               * Latin1 encoding strategy.
               */
              var Latin1 = (C_enc.Latin1 = {
                /**
                 * Converts a word array to a Latin1 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Latin1 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                  // Shortcuts
                  var words = wordArray.words;
                  var sigBytes = wordArray.sigBytes;

                  // Convert
                  var latin1Chars = [];
                  for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    latin1Chars.push(String.fromCharCode(bite));
                  }

                  return latin1Chars.join('');
                },

                /**
                 * Converts a Latin1 string to a word array.
                 *
                 * @param {string} latin1Str The Latin1 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                 */
                parse: function (latin1Str) {
                  // Shortcut
                  var latin1StrLength = latin1Str.length;

                  // Convert
                  var words = [];
                  for (var i = 0; i < latin1StrLength; i++) {
                    words[i >>> 2] |=
                      (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                  }

                  return new WordArray.init(words, latin1StrLength);
                },
              });

              /**
               * UTF-8 encoding strategy.
               */
              var Utf8 = (C_enc.Utf8 = {
                /**
                 * Converts a word array to a UTF-8 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-8 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                  try {
                    return decodeURIComponent(
                      escape(Latin1.stringify(wordArray))
                    );
                  } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                  }
                },

                /**
                 * Converts a UTF-8 string to a word array.
                 *
                 * @param {string} utf8Str The UTF-8 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                 */
                parse: function (utf8Str) {
                  return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                },
              });

              /**
               * Abstract buffered block algorithm template.
               *
               * The property blockSize must be implemented in a concrete subtype.
               *
               * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
               */
              var BufferedBlockAlgorithm = (C_lib.BufferedBlockAlgorithm =
                Base.extend({
                  /**
                   * Resets this block algorithm's data buffer to its initial state.
                   *
                   * @example
                   *
                   *     bufferedBlockAlgorithm.reset();
                   */
                  reset: function () {
                    // Initial values
                    this._data = new WordArray.init();
                    this._nDataBytes = 0;
                  },

                  /**
                   * Adds new data to this block algorithm's buffer.
                   *
                   * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                   *
                   * @example
                   *
                   *     bufferedBlockAlgorithm._append('data');
                   *     bufferedBlockAlgorithm._append(wordArray);
                   */
                  _append: function (data) {
                    // Convert string to WordArray, else assume WordArray already
                    if (typeof data == 'string') {
                      data = Utf8.parse(data);
                    }

                    // Append
                    this._data.concat(data);
                    this._nDataBytes += data.sigBytes;
                  },

                  /**
                   * Processes available data blocks.
                   *
                   * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                   *
                   * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                   *
                   * @return {WordArray} The processed data.
                   *
                   * @example
                   *
                   *     var processedData = bufferedBlockAlgorithm._process();
                   *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                   */
                  _process: function (doFlush) {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;
                    var dataSigBytes = data.sigBytes;
                    var blockSize = this.blockSize;
                    var blockSizeBytes = blockSize * 4;

                    // Count blocks ready
                    var nBlocksReady = dataSigBytes / blockSizeBytes;
                    if (doFlush) {
                      // Round up to include partial blocks
                      nBlocksReady = Math.ceil(nBlocksReady);
                    } else {
                      // Round down to include only full blocks,
                      // less the number of blocks that must remain in the buffer
                      nBlocksReady = Math.max(
                        (nBlocksReady | 0) - this._minBufferSize,
                        0
                      );
                    }

                    // Count words ready
                    var nWordsReady = nBlocksReady * blockSize;

                    // Count bytes ready
                    var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                    // Process blocks
                    if (nWordsReady) {
                      for (
                        var offset = 0;
                        offset < nWordsReady;
                        offset += blockSize
                      ) {
                        // Perform concrete-algorithm logic
                        this._doProcessBlock(dataWords, offset);
                      }

                      // Remove processed words
                      var processedWords = dataWords.splice(0, nWordsReady);
                      data.sigBytes -= nBytesReady;
                    }

                    // Return processed words
                    return new WordArray.init(processedWords, nBytesReady);
                  },

                  /**
                   * Creates a copy of this object.
                   *
                   * @return {Object} The clone.
                   *
                   * @example
                   *
                   *     var clone = bufferedBlockAlgorithm.clone();
                   */
                  clone: function () {
                    var clone = Base.clone.call(this);
                    clone._data = this._data.clone();

                    return clone;
                  },

                  _minBufferSize: 0,
                }));

              /**
               * Abstract hasher template.
               *
               * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
               */
              var Hasher = (C_lib.Hasher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 */
                cfg: Base.extend(),

                /**
                 * Initializes a newly created hasher.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                 *
                 * @example
                 *
                 *     var hasher = CryptoJS.algo.SHA256.create();
                 */
                init: function (cfg) {
                  // Apply config defaults
                  this.cfg = this.cfg.extend(cfg);

                  // Set initial values
                  this.reset();
                },

                /**
                 * Resets this hasher to its initial state.
                 *
                 * @example
                 *
                 *     hasher.reset();
                 */
                reset: function () {
                  // Reset data buffer
                  BufferedBlockAlgorithm.reset.call(this);

                  // Perform concrete-hasher logic
                  this._doReset();
                },

                /**
                 * Updates this hasher with a message.
                 *
                 * @param {WordArray|string} messageUpdate The message to append.
                 *
                 * @return {Hasher} This hasher.
                 *
                 * @example
                 *
                 *     hasher.update('message');
                 *     hasher.update(wordArray);
                 */
                update: function (messageUpdate) {
                  // Append
                  this._append(messageUpdate);

                  // Update the hash
                  this._process();

                  // Chainable
                  return this;
                },

                /**
                 * Finalizes the hash computation.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} messageUpdate (Optional) A final message update.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @example
                 *
                 *     var hash = hasher.finalize();
                 *     var hash = hasher.finalize('message');
                 *     var hash = hasher.finalize(wordArray);
                 */
                finalize: function (messageUpdate) {
                  // Final message update
                  if (messageUpdate) {
                    this._append(messageUpdate);
                  }

                  // Perform concrete-hasher logic
                  var hash = this._doFinalize();

                  return hash;
                },

                blockSize: 512 / 32,

                /**
                 * Creates a shortcut function to a hasher's object interface.
                 *
                 * @param {Hasher} hasher The hasher to create a helper for.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                 */
                _createHelper: function (hasher) {
                  return function (message, cfg) {
                    return new hasher.init(cfg).finalize(message);
                  };
                },

                /**
                 * Creates a shortcut function to the HMAC's object interface.
                 *
                 * @param {Hasher} hasher The hasher to use in this HMAC helper.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                 */
                _createHmacHelper: function (hasher) {
                  return function (message, key) {
                    return new C_algo.HMAC.init(hasher, key).finalize(message);
                  };
                },
              }));

              /**
               * Algorithm namespace.
               */
              var C_algo = (C.algo = {});

              return C;
            })(Math);

          return CryptoJS;
        });
      },
      {},
    ],
    10: [
      function (require, module, exports) {
        (function (root, factory, undef) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(
              require('./core'),
              require('./sha256'),
              require('./hmac')
            );
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core', './sha256', './hmac'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function (CryptoJS) {
          return CryptoJS.HmacSHA256;
        });
      },
      { './core': 9, './hmac': 11, './sha256': 12 },
    ],
    11: [
      function (require, module, exports) {
        (function (root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function (CryptoJS) {
          (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var C_algo = C.algo;

            /**
             * HMAC algorithm.
             */
            var HMAC = (C_algo.HMAC = Base.extend({
              /**
               * Initializes a newly created HMAC.
               *
               * @param {Hasher} hasher The hash algorithm to use.
               * @param {WordArray|string} key The secret key.
               *
               * @example
               *
               *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
               */
              init: function (hasher, key) {
                // Init hasher
                hasher = this._hasher = new hasher.init();

                // Convert string to WordArray, else assume WordArray already
                if (typeof key == 'string') {
                  key = Utf8.parse(key);
                }

                // Shortcuts
                var hasherBlockSize = hasher.blockSize;
                var hasherBlockSizeBytes = hasherBlockSize * 4;

                // Allow arbitrary length keys
                if (key.sigBytes > hasherBlockSizeBytes) {
                  key = hasher.finalize(key);
                }

                // Clamp excess bits
                key.clamp();

                // Clone key for inner and outer pads
                var oKey = (this._oKey = key.clone());
                var iKey = (this._iKey = key.clone());

                // Shortcuts
                var oKeyWords = oKey.words;
                var iKeyWords = iKey.words;

                // XOR keys with pad constants
                for (var i = 0; i < hasherBlockSize; i++) {
                  oKeyWords[i] ^= 0x5c5c5c5c;
                  iKeyWords[i] ^= 0x36363636;
                }
                oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

                // Set initial values
                this.reset();
              },

              /**
               * Resets this HMAC to its initial state.
               *
               * @example
               *
               *     hmacHasher.reset();
               */
              reset: function () {
                // Shortcut
                var hasher = this._hasher;

                // Reset
                hasher.reset();
                hasher.update(this._iKey);
              },

              /**
               * Updates this HMAC with a message.
               *
               * @param {WordArray|string} messageUpdate The message to append.
               *
               * @return {HMAC} This HMAC instance.
               *
               * @example
               *
               *     hmacHasher.update('message');
               *     hmacHasher.update(wordArray);
               */
              update: function (messageUpdate) {
                this._hasher.update(messageUpdate);

                // Chainable
                return this;
              },

              /**
               * Finalizes the HMAC computation.
               * Note that the finalize operation is effectively a destructive, read-once operation.
               *
               * @param {WordArray|string} messageUpdate (Optional) A final message update.
               *
               * @return {WordArray} The HMAC.
               *
               * @example
               *
               *     var hmac = hmacHasher.finalize();
               *     var hmac = hmacHasher.finalize('message');
               *     var hmac = hmacHasher.finalize(wordArray);
               */
              finalize: function (messageUpdate) {
                // Shortcut
                var hasher = this._hasher;

                // Compute HMAC
                var innerHash = hasher.finalize(messageUpdate);
                hasher.reset();
                var hmac = hasher.finalize(
                  this._oKey.clone().concat(innerHash)
                );

                return hmac;
              },
            }));
          })();
        });
      },
      { './core': 9 },
    ],
    12: [
      function (require, module, exports) {
        (function (root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function (CryptoJS) {
          (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Initialization and round constants tables
            var H = [];
            var K = [];

            // Compute constants
            (function () {
              function isPrime(n) {
                var sqrtN = Math.sqrt(n);
                for (var factor = 2; factor <= sqrtN; factor++) {
                  if (!(n % factor)) {
                    return false;
                  }
                }

                return true;
              }

              function getFractionalBits(n) {
                return ((n - (n | 0)) * 0x100000000) | 0;
              }

              var n = 2;
              var nPrime = 0;
              while (nPrime < 64) {
                if (isPrime(n)) {
                  if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                  }
                  K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                  nPrime++;
                }

                n++;
              }
            })();

            // Reusable object
            var W = [];

            /**
             * SHA-256 hash algorithm.
             */
            var SHA256 = (C_algo.SHA256 = Hasher.extend({
              _doReset: function () {
                this._hash = new WordArray.init(H.slice(0));
              },

              _doProcessBlock: function (M, offset) {
                // Shortcut
                var H = this._hash.words;

                // Working variables
                var a = H[0];
                var b = H[1];
                var c = H[2];
                var d = H[3];
                var e = H[4];
                var f = H[5];
                var g = H[6];
                var h = H[7];

                // Computation
                for (var i = 0; i < 64; i++) {
                  if (i < 16) {
                    W[i] = M[offset + i] | 0;
                  } else {
                    var gamma0x = W[i - 15];
                    var gamma0 =
                      ((gamma0x << 25) | (gamma0x >>> 7)) ^
                      ((gamma0x << 14) | (gamma0x >>> 18)) ^
                      (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1 =
                      ((gamma1x << 15) | (gamma1x >>> 17)) ^
                      ((gamma1x << 13) | (gamma1x >>> 19)) ^
                      (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                  }

                  var ch = (e & f) ^ (~e & g);
                  var maj = (a & b) ^ (a & c) ^ (b & c);

                  var sigma0 =
                    ((a << 30) | (a >>> 2)) ^
                    ((a << 19) | (a >>> 13)) ^
                    ((a << 10) | (a >>> 22));
                  var sigma1 =
                    ((e << 26) | (e >>> 6)) ^
                    ((e << 21) | (e >>> 11)) ^
                    ((e << 7) | (e >>> 25));

                  var t1 = h + sigma1 + ch + K[i] + W[i];
                  var t2 = sigma0 + maj;

                  h = g;
                  g = f;
                  f = e;
                  e = (d + t1) | 0;
                  d = c;
                  c = b;
                  b = a;
                  a = (t1 + t2) | 0;
                }

                // Intermediate hash value
                H[0] = (H[0] + a) | 0;
                H[1] = (H[1] + b) | 0;
                H[2] = (H[2] + c) | 0;
                H[3] = (H[3] + d) | 0;
                H[4] = (H[4] + e) | 0;
                H[5] = (H[5] + f) | 0;
                H[6] = (H[6] + g) | 0;
                H[7] = (H[7] + h) | 0;
              },

              _doFinalize: function () {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;

                var nBitsTotal = this._nDataBytes * 8;
                var nBitsLeft = data.sigBytes * 8;

                // Add padding
                dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
                  nBitsTotal / 0x100000000
                );
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                data.sigBytes = dataWords.length * 4;

                // Hash final blocks
                this._process();

                // Return final computed hash
                return this._hash;
              },

              clone: function () {
                var clone = Hasher.clone.call(this);
                clone._hash = this._hash.clone();

                return clone;
              },
            }));

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA256('message');
             *     var hash = CryptoJS.SHA256(wordArray);
             */
            C.SHA256 = Hasher._createHelper(SHA256);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA256(message, key);
             */
            C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
          })(Math);

          return CryptoJS.SHA256;
        });
      },
      { './core': 9 },
    ],
    13: [
      function (require, module, exports) {
        // This file is the concatenation of many js files.
        // See http://github.com/jimhigson/oboe.js for the raw source

        // having a local undefined, window, Object etc allows slightly better minification:
        (function (window, Object, Array, Error, JSON, undefined) {
          // v2.1.3-15-g7432b49

          /*

Copyright (c) 2013, Jim Higson

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

1.  Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

2.  Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

          /**
           * Partially complete a function.
           *
           *  var add3 = partialComplete( function add(a,b){return a+b}, 3 );
           *
           *  add3(4) // gives 7
           *
           *  function wrap(left, right, cen){return left + " " + cen + " " + right;}
           *
           *  var pirateGreeting = partialComplete( wrap , "I'm", ", a mighty pirate!" );
           *
           *  pirateGreeting("Guybrush Threepwood");
           *  // gives "I'm Guybrush Threepwood, a mighty pirate!"
           */
          var partialComplete = varArgs(function (fn, args) {
              // this isn't the shortest way to write this but it does
              // avoid creating a new array each time to pass to fn.apply,
              // otherwise could just call boundArgs.concat(callArgs)

              var numBoundArgs = args.length;

              return varArgs(function (callArgs) {
                for (var i = 0; i < callArgs.length; i++) {
                  args[numBoundArgs + i] = callArgs[i];
                }

                args.length = numBoundArgs + callArgs.length;

                return fn.apply(this, args);
              });
            }),
            /**
             * Compose zero or more functions:
             *
             *    compose(f1, f2, f3)(x) = f1(f2(f3(x))))
             *
             * The last (inner-most) function may take more than one parameter:
             *
             *    compose(f1, f2, f3)(x,y) = f1(f2(f3(x,y))))
             */
            compose = varArgs(function (fns) {
              var fnsList = arrayAsList(fns);

              function next(params, curFn) {
                return [apply(params, curFn)];
              }

              return varArgs(function (startParams) {
                return foldR(next, startParams, fnsList)[0];
              });
            });

          /**
           * A more optimised version of compose that takes exactly two functions
           * @param f1
           * @param f2
           */
          function compose2(f1, f2) {
            return function () {
              return f1.call(this, f2.apply(this, arguments));
            };
          }

          /**
           * Generic form for a function to get a property from an object
           *
           *    var o = {
           *       foo:'bar'
           *    }
           *
           *    var getFoo = attr('foo')
           *
           *    fetFoo(o) // returns 'bar'
           *
           * @param {String} key the property name
           */
          function attr(key) {
            return function (o) {
              return o[key];
            };
          }

          /**
           * Call a list of functions with the same args until one returns a
           * truthy result. Similar to the || operator.
           *
           * So:
           *      lazyUnion([f1,f2,f3 ... fn])( p1, p2 ... pn )
           *
           * Is equivalent to:
           *      apply([p1, p2 ... pn], f1) ||
           *      apply([p1, p2 ... pn], f2) ||
           *      apply([p1, p2 ... pn], f3) ... apply(fn, [p1, p2 ... pn])
           *
           * @returns the first return value that is given that is truthy.
           */
          var lazyUnion = varArgs(function (fns) {
            return varArgs(function (params) {
              var maybeValue;

              for (var i = 0; i < len(fns); i++) {
                maybeValue = apply(params, fns[i]);

                if (maybeValue) {
                  return maybeValue;
                }
              }
            });
          });

          /**
           * This file declares various pieces of functional programming.
           *
           * This isn't a general purpose functional library, to keep things small it
           * has just the parts useful for Oboe.js.
           */

          /**
           * Call a single function with the given arguments array.
           * Basically, a functional-style version of the OO-style Function#apply for
           * when we don't care about the context ('this') of the call.
           *
           * The order of arguments allows partial completion of the arguments array
           */
          function apply(args, fn) {
            return fn.apply(undefined, args);
          }

          /**
           * Define variable argument functions but cut out all that tedious messing about
           * with the arguments object. Delivers the variable-length part of the arguments
           * list as an array.
           *
           * Eg:
           *
           * var myFunction = varArgs(
           *    function( fixedArgument, otherFixedArgument, variableNumberOfArguments ){
           *       console.log( variableNumberOfArguments );
           *    }
           * )
           *
           * myFunction('a', 'b', 1, 2, 3); // logs [1,2,3]
           *
           * var myOtherFunction = varArgs(function( variableNumberOfArguments ){
           *    console.log( variableNumberOfArguments );
           * })
           *
           * myFunction(1, 2, 3); // logs [1,2,3]
           *
           */
          function varArgs(fn) {
            var numberOfFixedArguments = fn.length - 1,
              slice = Array.prototype.slice;

            if (numberOfFixedArguments == 0) {
              // an optimised case for when there are no fixed args:

              return function () {
                return fn.call(this, slice.call(arguments));
              };
            } else if (numberOfFixedArguments == 1) {
              // an optimised case for when there are is one fixed args:

              return function () {
                return fn.call(this, arguments[0], slice.call(arguments, 1));
              };
            }

            // general case

            // we know how many arguments fn will always take. Create a
            // fixed-size array to hold that many, to be re-used on
            // every call to the returned function
            var argsHolder = Array(fn.length);

            return function () {
              for (var i = 0; i < numberOfFixedArguments; i++) {
                argsHolder[i] = arguments[i];
              }

              argsHolder[numberOfFixedArguments] = slice.call(
                arguments,
                numberOfFixedArguments
              );

              return fn.apply(this, argsHolder);
            };
          }

          /**
           * Swap the order of parameters to a binary function
           *
           * A bit like this flip: http://zvon.org/other/haskell/Outputprelude/flip_f.html
           */
          function flip(fn) {
            return function (a, b) {
              return fn(b, a);
            };
          }

          /**
           * Create a function which is the intersection of two other functions.
           *
           * Like the && operator, if the first is truthy, the second is never called,
           * otherwise the return value from the second is returned.
           */
          function lazyIntersection(fn1, fn2) {
            return function (param) {
              return fn1(param) && fn2(param);
            };
          }

          /**
           * A function which does nothing
           */
          function noop() {}

          /**
           * A function which is always happy
           */
          function always() {
            return true;
          }

          /**
           * Create a function which always returns the same
           * value
           *
           * var return3 = functor(3);
           *
           * return3() // gives 3
           * return3() // still gives 3
           * return3() // will always give 3
           */
          function functor(val) {
            return function () {
              return val;
            };
          }

          /**
           * This file defines some loosely associated syntactic sugar for
           * Javascript programming
           */

          /**
           * Returns true if the given candidate is of type T
           */
          function isOfType(T, maybeSomething) {
            return maybeSomething && maybeSomething.constructor === T;
          }

          var len = attr('length'),
            isString = partialComplete(isOfType, String);

          /**
           * I don't like saying this:
           *
           *    foo !=== undefined
           *
           * because of the double-negative. I find this:
           *
           *    defined(foo)
           *
           * easier to read.
           */
          function defined(value) {
            return value !== undefined;
          }

          /**
           * Returns true if object o has a key named like every property in
           * the properties array. Will give false if any are missing, or if o
           * is not an object.
           */
          function hasAllProperties(fieldList, o) {
            return (
              o instanceof Object &&
              all(function (field) {
                return field in o;
              }, fieldList)
            );
          }
          /**
           * Like cons in Lisp
           */
          function cons(x, xs) {
            /* Internally lists are linked 2-element Javascript arrays.
          
      Ideally the return here would be Object.freeze([x,xs])
      so that bugs related to mutation are found fast.
      However, cons is right on the critical path for
      performance and this slows oboe-mark down by
      ~25%. Under theoretical future JS engines that freeze more
      efficiently (possibly even use immutability to
      run faster) this should be considered for
      restoration.
   */

            return [x, xs];
          }

          /**
           * The empty list
           */
          var emptyList = null,
            /**
             * Get the head of a list.
             *
             * Ie, head(cons(a,b)) = a
             */
            head = attr(0),
            /**
             * Get the tail of a list.
             *
             * Ie, tail(cons(a,b)) = b
             */
            tail = attr(1);

          /**
           * Converts an array to a list
           *
           *    asList([a,b,c])
           *
           * is equivalent to:
           *
           *    cons(a, cons(b, cons(c, emptyList)))
           **/
          function arrayAsList(inputArray) {
            return reverseList(inputArray.reduce(flip(cons), emptyList));
          }

          /**
           * A varargs version of arrayAsList. Works a bit like list
           * in LISP.
           *
           *    list(a,b,c)
           *
           * is equivalent to:
           *
           *    cons(a, cons(b, cons(c, emptyList)))
           */
          var list = varArgs(arrayAsList);

          /**
           * Convert a list back to a js native array
           */
          function listAsArray(list) {
            return foldR(
              function (arraySoFar, listItem) {
                arraySoFar.unshift(listItem);
                return arraySoFar;
              },
              [],
              list
            );
          }

          /**
           * Map a function over a list
           */
          function map(fn, list) {
            return list ? cons(fn(head(list)), map(fn, tail(list))) : emptyList;
          }

          /**
           * foldR implementation. Reduce a list down to a single value.
           *
           * @pram {Function} fn     (rightEval, curVal) -> result
           */
          function foldR(fn, startValue, list) {
            return list
              ? fn(foldR(fn, startValue, tail(list)), head(list))
              : startValue;
          }

          /**
           * foldR implementation. Reduce a list down to a single value.
           *
           * @pram {Function} fn     (rightEval, curVal) -> result
           */
          function foldR1(fn, list) {
            return tail(list)
              ? fn(foldR1(fn, tail(list)), head(list))
              : head(list);
          }

          /**
           * Return a list like the one given but with the first instance equal
           * to item removed
           */
          function without(list, test, removedFn) {
            return withoutInner(list, removedFn || noop);

            function withoutInner(subList, removedFn) {
              return subList
                ? test(head(subList))
                  ? (removedFn(head(subList)), tail(subList))
                  : cons(head(subList), withoutInner(tail(subList), removedFn))
                : emptyList;
            }
          }

          /**
           * Returns true if the given function holds for every item in
           * the list, false otherwise
           */
          function all(fn, list) {
            return !list || (fn(head(list)) && all(fn, tail(list)));
          }

          /**
           * Call every function in a list of functions with the same arguments
           *
           * This doesn't make any sense if we're doing pure functional because
           * it doesn't return anything. Hence, this is only really useful if the
           * functions being called have side-effects.
           */
          function applyEach(fnList, args) {
            if (fnList) {
              head(fnList).apply(null, args);

              applyEach(tail(fnList), args);
            }
          }

          /**
           * Reverse the order of a list
           */
          function reverseList(list) {
            // js re-implementation of 3rd solution from:
            //    http://www.haskell.org/haskellwiki/99_questions/Solutions/5
            function reverseInner(list, reversedAlready) {
              if (!list) {
                return reversedAlready;
              }

              return reverseInner(
                tail(list),
                cons(head(list), reversedAlready)
              );
            }

            return reverseInner(list, emptyList);
          }

          function first(test, list) {
            return (
              list && (test(head(list)) ? head(list) : first(test, tail(list)))
            );
          }

          /* 
   This is a slightly hacked-up browser only version of clarinet 
   
      *  some features removed to help keep browser Oboe under 
         the 5k micro-library limit
      *  plug directly into event bus
   
   For the original go here:
      https://github.com/dscape/clarinet

   We receive the events:
      STREAM_DATA
      STREAM_END
      
   We emit the events:
      SAX_KEY
      SAX_VALUE_OPEN
      SAX_VALUE_CLOSE      
      FAIL_EVENT      
 */

          function clarinet(eventBus) {
            'use strict';

            var // shortcut some events on the bus
              emitSaxKey = eventBus(SAX_KEY).emit,
              emitValueOpen = eventBus(SAX_VALUE_OPEN).emit,
              emitValueClose = eventBus(SAX_VALUE_CLOSE).emit,
              emitFail = eventBus(FAIL_EVENT).emit,
              MAX_BUFFER_LENGTH = 64 * 1024,
              stringTokenPattern = /[\\"\n]/g,
              _n = 0,
              // states
              BEGIN = _n++,
              VALUE = _n++, // general stuff
              OPEN_OBJECT = _n++, // {
              CLOSE_OBJECT = _n++, // }
              OPEN_ARRAY = _n++, // [
              CLOSE_ARRAY = _n++, // ]
              STRING = _n++, // ""
              OPEN_KEY = _n++, // , "a"
              CLOSE_KEY = _n++, // :
              TRUE = _n++, // r
              TRUE2 = _n++, // u
              TRUE3 = _n++, // e
              FALSE = _n++, // a
              FALSE2 = _n++, // l
              FALSE3 = _n++, // s
              FALSE4 = _n++, // e
              NULL = _n++, // u
              NULL2 = _n++, // l
              NULL3 = _n++, // l
              NUMBER_DECIMAL_POINT = _n++, // .
              NUMBER_DIGIT = _n, // [0-9]
              // setup initial parser values
              bufferCheckPosition = MAX_BUFFER_LENGTH,
              latestError,
              c,
              p,
              textNode = undefined,
              numberNode = '',
              slashed = false,
              closed = false,
              state = BEGIN,
              stack = [],
              unicodeS = null,
              unicodeI = 0,
              depth = 0,
              position = 0,
              column = 0, //mostly for error reporting
              line = 1;
            function checkBufferLength() {
              var maxActual = 0;

              if (
                textNode !== undefined &&
                textNode.length > MAX_BUFFER_LENGTH
              ) {
                emitError('Max buffer length exceeded: textNode');
                maxActual = Math.max(maxActual, textNode.length);
              }
              if (numberNode.length > MAX_BUFFER_LENGTH) {
                emitError('Max buffer length exceeded: numberNode');
                maxActual = Math.max(maxActual, numberNode.length);
              }

              bufferCheckPosition = MAX_BUFFER_LENGTH - maxActual + position;
            }

            eventBus(STREAM_DATA).on(handleData);

            /* At the end of the http content close the clarinet 
    This will provide an error if the total content provided was not 
    valid json, ie if not all arrays, objects and Strings closed properly */
            eventBus(STREAM_END).on(handleStreamEnd);

            function emitError(errorString) {
              if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
              }

              latestError = Error(
                errorString +
                  '\nLn: ' +
                  line +
                  '\nCol: ' +
                  column +
                  '\nChr: ' +
                  c
              );

              emitFail(errorReport(undefined, undefined, latestError));
            }

            function handleStreamEnd() {
              if (state == BEGIN) {
                // Handle the case where the stream closes without ever receiving
                // any input. This isn't an error - response bodies can be blank,
                // particularly for 204 http responses

                // Because of how Oboe is currently implemented, we parse a
                // completely empty stream as containing an empty object.
                // This is because Oboe's done event is only fired when the
                // root object of the JSON stream closes.

                // This should be decoupled and attached instead to the input stream
                // from the http (or whatever) resource ending.
                // If this decoupling could happen the SAX parser could simply emit
                // zero events on a completely empty input.
                emitValueOpen({});
                emitValueClose();

                closed = true;
                return;
              }

              if (state !== VALUE || depth !== 0) emitError('Unexpected end');

              if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
              }

              closed = true;
            }

            function whitespace(c) {
              return c == '\r' || c == '\n' || c == ' ' || c == '\t';
            }

            function handleData(chunk) {
              // this used to throw the error but inside Oboe we will have already
              // gotten the error when it was emitted. The important thing is to
              // not continue with the parse.
              if (latestError) return;

              if (closed) {
                return emitError('Cannot write after close');
              }

              var i = 0;
              c = chunk[0];

              while (c) {
                if (i > 0) {
                  p = c;
                }
                c = chunk[i++];
                if (!c) break;

                position++;
                if (c == '\n') {
                  line++;
                  column = 0;
                } else column++;
                switch (state) {
                  case BEGIN:
                    if (c === '{') state = OPEN_OBJECT;
                    else if (c === '[') state = OPEN_ARRAY;
                    else if (!whitespace(c))
                      return emitError('Non-whitespace before {[.');
                    continue;

                  case OPEN_KEY:
                  case OPEN_OBJECT:
                    if (whitespace(c)) continue;
                    if (state === OPEN_KEY) stack.push(CLOSE_KEY);
                    else {
                      if (c === '}') {
                        emitValueOpen({});
                        emitValueClose();
                        state = stack.pop() || VALUE;
                        continue;
                      } else stack.push(CLOSE_OBJECT);
                    }
                    if (c === '"') state = STRING;
                    else
                      return emitError(
                        'Malformed object key should start with " '
                      );
                    continue;

                  case CLOSE_KEY:
                  case CLOSE_OBJECT:
                    if (whitespace(c)) continue;

                    if (c === ':') {
                      if (state === CLOSE_OBJECT) {
                        stack.push(CLOSE_OBJECT);

                        if (textNode !== undefined) {
                          // was previously (in upstream Clarinet) one event
                          //  - object open came with the text of the first
                          emitValueOpen({});
                          emitSaxKey(textNode);
                          textNode = undefined;
                        }
                        depth++;
                      } else {
                        if (textNode !== undefined) {
                          emitSaxKey(textNode);
                          textNode = undefined;
                        }
                      }
                      state = VALUE;
                    } else if (c === '}') {
                      if (textNode !== undefined) {
                        emitValueOpen(textNode);
                        emitValueClose();
                        textNode = undefined;
                      }
                      emitValueClose();
                      depth--;
                      state = stack.pop() || VALUE;
                    } else if (c === ',') {
                      if (state === CLOSE_OBJECT) stack.push(CLOSE_OBJECT);
                      if (textNode !== undefined) {
                        emitValueOpen(textNode);
                        emitValueClose();
                        textNode = undefined;
                      }
                      state = OPEN_KEY;
                    } else return emitError('Bad object');
                    continue;

                  case OPEN_ARRAY: // after an array there always a value
                  case VALUE:
                    if (whitespace(c)) continue;
                    if (state === OPEN_ARRAY) {
                      emitValueOpen([]);
                      depth++;
                      state = VALUE;
                      if (c === ']') {
                        emitValueClose();
                        depth--;
                        state = stack.pop() || VALUE;
                        continue;
                      } else {
                        stack.push(CLOSE_ARRAY);
                      }
                    }
                    if (c === '"') state = STRING;
                    else if (c === '{') state = OPEN_OBJECT;
                    else if (c === '[') state = OPEN_ARRAY;
                    else if (c === 't') state = TRUE;
                    else if (c === 'f') state = FALSE;
                    else if (c === 'n') state = NULL;
                    else if (c === '-') {
                      // keep and continue
                      numberNode += c;
                    } else if (c === '0') {
                      numberNode += c;
                      state = NUMBER_DIGIT;
                    } else if ('123456789'.indexOf(c) !== -1) {
                      numberNode += c;
                      state = NUMBER_DIGIT;
                    } else return emitError('Bad value');
                    continue;

                  case CLOSE_ARRAY:
                    if (c === ',') {
                      stack.push(CLOSE_ARRAY);
                      if (textNode !== undefined) {
                        emitValueOpen(textNode);
                        emitValueClose();
                        textNode = undefined;
                      }
                      state = VALUE;
                    } else if (c === ']') {
                      if (textNode !== undefined) {
                        emitValueOpen(textNode);
                        emitValueClose();
                        textNode = undefined;
                      }
                      emitValueClose();
                      depth--;
                      state = stack.pop() || VALUE;
                    } else if (whitespace(c)) continue;
                    else return emitError('Bad array');
                    continue;

                  case STRING:
                    if (textNode === undefined) {
                      textNode = '';
                    }

                    // thanks thejh, this is an about 50% performance improvement.
                    var starti = i - 1;

                    STRING_BIGLOOP: while (true) {
                      // zero means "no unicode active". 1-4 mean "parse some more". end after 4.
                      while (unicodeI > 0) {
                        unicodeS += c;
                        c = chunk.charAt(i++);
                        if (unicodeI === 4) {
                          // TODO this might be slow? well, probably not used too often anyway
                          textNode += String.fromCharCode(
                            parseInt(unicodeS, 16)
                          );
                          unicodeI = 0;
                          starti = i - 1;
                        } else {
                          unicodeI++;
                        }
                        // we can just break here: no stuff we skipped that still has to be sliced out or so
                        if (!c) break STRING_BIGLOOP;
                      }
                      if (c === '"' && !slashed) {
                        state = stack.pop() || VALUE;
                        textNode += chunk.substring(starti, i - 1);
                        break;
                      }
                      if (c === '\\' && !slashed) {
                        slashed = true;
                        textNode += chunk.substring(starti, i - 1);
                        c = chunk.charAt(i++);
                        if (!c) break;
                      }
                      if (slashed) {
                        slashed = false;
                        if (c === 'n') {
                          textNode += '\n';
                        } else if (c === 'r') {
                          textNode += '\r';
                        } else if (c === 't') {
                          textNode += '\t';
                        } else if (c === 'f') {
                          textNode += '\f';
                        } else if (c === 'b') {
                          textNode += '\b';
                        } else if (c === 'u') {
                          // \uxxxx. meh!
                          unicodeI = 1;
                          unicodeS = '';
                        } else {
                          textNode += c;
                        }
                        c = chunk.charAt(i++);
                        starti = i - 1;
                        if (!c) break;
                        else continue;
                      }

                      stringTokenPattern.lastIndex = i;
                      var reResult = stringTokenPattern.exec(chunk);
                      if (!reResult) {
                        i = chunk.length + 1;
                        textNode += chunk.substring(starti, i - 1);
                        break;
                      }
                      i = reResult.index + 1;
                      c = chunk.charAt(reResult.index);
                      if (!c) {
                        textNode += chunk.substring(starti, i - 1);
                        break;
                      }
                    }
                    continue;

                  case TRUE:
                    if (!c) continue; // strange buffers
                    if (c === 'r') state = TRUE2;
                    else return emitError('Invalid true started with t' + c);
                    continue;

                  case TRUE2:
                    if (!c) continue;
                    if (c === 'u') state = TRUE3;
                    else return emitError('Invalid true started with tr' + c);
                    continue;

                  case TRUE3:
                    if (!c) continue;
                    if (c === 'e') {
                      emitValueOpen(true);
                      emitValueClose();
                      state = stack.pop() || VALUE;
                    } else
                      return emitError('Invalid true started with tru' + c);
                    continue;

                  case FALSE:
                    if (!c) continue;
                    if (c === 'a') state = FALSE2;
                    else return emitError('Invalid false started with f' + c);
                    continue;

                  case FALSE2:
                    if (!c) continue;
                    if (c === 'l') state = FALSE3;
                    else return emitError('Invalid false started with fa' + c);
                    continue;

                  case FALSE3:
                    if (!c) continue;
                    if (c === 's') state = FALSE4;
                    else return emitError('Invalid false started with fal' + c);
                    continue;

                  case FALSE4:
                    if (!c) continue;
                    if (c === 'e') {
                      emitValueOpen(false);
                      emitValueClose();
                      state = stack.pop() || VALUE;
                    } else
                      return emitError('Invalid false started with fals' + c);
                    continue;

                  case NULL:
                    if (!c) continue;
                    if (c === 'u') state = NULL2;
                    else return emitError('Invalid null started with n' + c);
                    continue;

                  case NULL2:
                    if (!c) continue;
                    if (c === 'l') state = NULL3;
                    else return emitError('Invalid null started with nu' + c);
                    continue;

                  case NULL3:
                    if (!c) continue;
                    if (c === 'l') {
                      emitValueOpen(null);
                      emitValueClose();
                      state = stack.pop() || VALUE;
                    } else
                      return emitError('Invalid null started with nul' + c);
                    continue;

                  case NUMBER_DECIMAL_POINT:
                    if (c === '.') {
                      numberNode += c;
                      state = NUMBER_DIGIT;
                    } else return emitError('Leading zero not followed by .');
                    continue;

                  case NUMBER_DIGIT:
                    if ('0123456789'.indexOf(c) !== -1) numberNode += c;
                    else if (c === '.') {
                      if (numberNode.indexOf('.') !== -1)
                        return emitError('Invalid number has two dots');
                      numberNode += c;
                    } else if (c === 'e' || c === 'E') {
                      if (
                        numberNode.indexOf('e') !== -1 ||
                        numberNode.indexOf('E') !== -1
                      )
                        return emitError('Invalid number has two exponential');
                      numberNode += c;
                    } else if (c === '+' || c === '-') {
                      if (!(p === 'e' || p === 'E'))
                        return emitError('Invalid symbol in number');
                      numberNode += c;
                    } else {
                      if (numberNode) {
                        emitValueOpen(parseFloat(numberNode));
                        emitValueClose();
                        numberNode = '';
                      }
                      i--; // go back one
                      state = stack.pop() || VALUE;
                    }
                    continue;

                  default:
                    return emitError('Unknown state: ' + state);
                }
              }
              if (position >= bufferCheckPosition) checkBufferLength();
            }
          }

          /**
           * A bridge used to assign stateless functions to listen to clarinet.
           *
           * As well as the parameter from clarinet, each callback will also be passed
           * the result of the last callback.
           *
           * This may also be used to clear all listeners by assigning zero handlers:
           *
           *    ascentManager( clarinet, {} )
           */
          function ascentManager(oboeBus, handlers) {
            'use strict';

            var listenerId = {},
              ascent;

            function stateAfter(handler) {
              return function (param) {
                ascent = handler(ascent, param);
              };
            }

            for (var eventName in handlers) {
              oboeBus(eventName).on(
                stateAfter(handlers[eventName]),
                listenerId
              );
            }

            oboeBus(NODE_SWAP).on(function (newNode) {
              var oldHead = head(ascent),
                key = keyOf(oldHead),
                ancestors = tail(ascent),
                parentNode;

              if (ancestors) {
                parentNode = nodeOf(head(ancestors));
                parentNode[key] = newNode;
              }
            });

            oboeBus(NODE_DROP).on(function () {
              var oldHead = head(ascent),
                key = keyOf(oldHead),
                ancestors = tail(ascent),
                parentNode;

              if (ancestors) {
                parentNode = nodeOf(head(ancestors));

                delete parentNode[key];
              }
            });

            oboeBus(ABORTING).on(function () {
              for (var eventName in handlers) {
                oboeBus(eventName).un(listenerId);
              }
            });
          }

          // based on gist https://gist.github.com/monsur/706839

          /**
           * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
           * headers according to the format described here:
           * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
           * This method parses that string into a user-friendly key/value pair object.
           */
          function parseResponseHeaders(headerStr) {
            var headers = {};

            headerStr &&
              headerStr.split('\u000d\u000a').forEach(function (headerPair) {
                // Can't use split() here because it does the wrong thing
                // if the header value has the string ": " in it.
                var index = headerPair.indexOf('\u003a\u0020');

                headers[headerPair.substring(0, index)] = headerPair.substring(
                  index + 2
                );
              });

            return headers;
          }

          /**
           * Detect if a given URL is cross-origin in the scope of the
           * current page.
           *
           * Browser only (since cross-origin has no meaning in Node.js)
           *
           * @param {Object} pageLocation - as in window.location
           * @param {Object} ajaxHost - an object like window.location describing the
           *    origin of the url that we want to ajax in
           */
          function isCrossOrigin(pageLocation, ajaxHost) {
            /*
             * NB: defaultPort only knows http and https.
             * Returns undefined otherwise.
             */
            function defaultPort(protocol) {
              return { 'http:': 80, 'https:': 443 }[protocol];
            }

            function portOf(location) {
              // pageLocation should always have a protocol. ajaxHost if no port or
              // protocol is specified, should use the port of the containing page

              return (
                location.port ||
                defaultPort(location.protocol || pageLocation.protocol)
              );
            }

            // if ajaxHost doesn't give a domain, port is the same as pageLocation
            // it can't give a protocol but not a domain
            // it can't give a port but not a domain

            return !!(
              (ajaxHost.protocol &&
                ajaxHost.protocol != pageLocation.protocol) ||
              (ajaxHost.host && ajaxHost.host != pageLocation.host) ||
              (ajaxHost.host && portOf(ajaxHost) != portOf(pageLocation))
            );
          }

          /* turn any url into an object like window.location */
          function parseUrlOrigin(url) {
            // url could be domain-relative
            // url could give a domain

            // cross origin means:
            //    same domain
            //    same port
            //    some protocol
            // so, same everything up to the first (single) slash
            // if such is given
            //
            // can ignore everything after that

            var URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/,
              // if no match, use an empty array so that
              // subexpressions 1,2,3 are all undefined
              // and will ultimately return all empty
              // strings as the parse result:
              urlHostMatch = URL_HOST_PATTERN.exec(url) || [];

            return {
              protocol: urlHostMatch[1] || '',
              host: urlHostMatch[2] || '',
              port: urlHostMatch[3] || '',
            };
          }

          function httpTransport() {
            return new XMLHttpRequest();
          }

          /**
           * A wrapper around the browser XmlHttpRequest object that raises an
           * event whenever a new part of the response is available.
           *
           * In older browsers progressive reading is impossible so all the
           * content is given in a single call. For newer ones several events
           * should be raised, allowing progressive interpretation of the response.
           *
           * @param {Function} oboeBus an event bus local to this Oboe instance
           * @param {XMLHttpRequest} xhr the xhr to use as the transport. Under normal
           *          operation, will have been created using httpTransport() above
           *          but for tests a stub can be provided instead.
           * @param {String} method one of 'GET' 'POST' 'PUT' 'PATCH' 'DELETE'
           * @param {String} url the url to make a request to
           * @param {String|Null} data some content to be sent with the request.
           *                      Only valid if method is POST or PUT.
           * @param {Object} [headers] the http request headers to send
           * @param {boolean} withCredentials the XHR withCredentials property will be
           *    set to this value
           */
          function streamingHttp(
            oboeBus,
            xhr,
            method,
            url,
            data,
            headers,
            withCredentials
          ) {
            'use strict';

            var emitStreamData = oboeBus(STREAM_DATA).emit,
              emitFail = oboeBus(FAIL_EVENT).emit,
              numberOfCharsAlreadyGivenToCallback = 0,
              stillToSendStartEvent = true;

            // When an ABORTING message is put on the event bus abort
            // the ajax request
            oboeBus(ABORTING).on(function () {
              // if we keep the onreadystatechange while aborting the XHR gives
              // a callback like a successful call so first remove this listener
              // by assigning null:
              xhr.onreadystatechange = null;

              xhr.abort();
            });

            /**
             * Handle input from the underlying xhr: either a state change,
             * the progress event or the request being complete.
             */
            function handleProgress() {
              var textSoFar = xhr.responseText,
                newText = textSoFar.substr(numberOfCharsAlreadyGivenToCallback);

              /* Raise the event for new text.
      
         On older browsers, the new text is the whole response. 
         On newer/better ones, the fragment part that we got since 
         last progress. */

              if (newText) {
                emitStreamData(newText);
              }

              numberOfCharsAlreadyGivenToCallback = len(textSoFar);
            }

            if ('onprogress' in xhr) {
              // detect browser support for progressive delivery
              xhr.onprogress = handleProgress;
            }

            xhr.onreadystatechange = function () {
              function sendStartIfNotAlready() {
                // Internet Explorer is very unreliable as to when xhr.status etc can
                // be read so has to be protected with try/catch and tried again on
                // the next readyState if it fails
                try {
                  stillToSendStartEvent &&
                    oboeBus(HTTP_START).emit(
                      xhr.status,
                      parseResponseHeaders(xhr.getAllResponseHeaders())
                    );
                  stillToSendStartEvent = false;
                } catch (e) {
                  /* do nothing, will try again on next readyState*/
                }
              }

              switch (xhr.readyState) {
                case 2: // HEADERS_RECEIVED
                case 3: // LOADING
                  return sendStartIfNotAlready();

                case 4: // DONE
                  sendStartIfNotAlready(); // if xhr.status hasn't been available yet, it must be NOW, huh IE?

                  // is this a 2xx http code?
                  var successful = String(xhr.status)[0] == 2;

                  if (successful) {
                    // In Chrome 29 (not 28) no onprogress is emitted when a response
                    // is complete before the onload. We need to always do handleInput
                    // in case we get the load but have not had a final progress event.
                    // This looks like a bug and may change in future but let's take
                    // the safest approach and assume we might not have received a
                    // progress event for each part of the response
                    handleProgress();

                    oboeBus(STREAM_END).emit();
                  } else {
                    emitFail(errorReport(xhr.status, xhr.responseText));
                  }
              }
            };

            try {
              xhr.open(method, url, true);

              for (var headerName in headers) {
                xhr.setRequestHeader(headerName, headers[headerName]);
              }

              if (!isCrossOrigin(window.location, parseUrlOrigin(url))) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              }

              xhr.withCredentials = withCredentials;

              xhr.send(data);
            } catch (e) {
              // To keep a consistent interface with Node, we can't emit an event here.
              // Node's streaming http adaptor receives the error as an asynchronous
              // event rather than as an exception. If we emitted now, the Oboe user
              // has had no chance to add a .fail listener so there is no way
              // the event could be useful. For both these reasons defer the
              // firing to the next JS frame.
              window.setTimeout(
                partialComplete(emitFail, errorReport(undefined, undefined, e)),
                0
              );
            }
          }

          var jsonPathSyntax = (function () {
            var /**
               * Export a regular expression as a simple function by exposing just
               * the Regex#exec. This allows regex tests to be used under the same
               * interface as differently implemented tests, or for a user of the
               * tests to not concern themselves with their implementation as regular
               * expressions.
               *
               * This could also be expressed point-free as:
               *   Function.prototype.bind.bind(RegExp.prototype.exec),
               *
               * But that's far too confusing! (and not even smaller once minified
               * and gzipped)
               */
              regexDescriptor = function regexDescriptor(regex) {
                return regex.exec.bind(regex);
              },
              /**
               * Join several regular expressions and express as a function.
               * This allows the token patterns to reuse component regular expressions
               * instead of being expressed in full using huge and confusing regular
               * expressions.
               */
              jsonPathClause = varArgs(function (componentRegexes) {
                // The regular expressions all start with ^ because we
                // only want to find matches at the start of the
                // JSONPath fragment we are inspecting
                componentRegexes.unshift(/^/);

                return regexDescriptor(
                  RegExp(componentRegexes.map(attr('source')).join(''))
                );
              }),
              possiblyCapturing = /(\$?)/,
              namedNode = /([\w-_]+|\*)/,
              namePlaceholder = /()/,
              nodeInArrayNotation = /\["([^"]+)"\]/,
              numberedNodeInArrayNotation = /\[(\d+|\*)\]/,
              fieldList = /{([\w ]*?)}/,
              optionalFieldList = /(?:{([\w ]*?)})?/,
              //   foo or *
              jsonPathNamedNodeInObjectNotation = jsonPathClause(
                possiblyCapturing,
                namedNode,
                optionalFieldList
              ),
              //   ["foo"]
              jsonPathNamedNodeInArrayNotation = jsonPathClause(
                possiblyCapturing,
                nodeInArrayNotation,
                optionalFieldList
              ),
              //   [2] or [*]
              jsonPathNumberedNodeInArrayNotation = jsonPathClause(
                possiblyCapturing,
                numberedNodeInArrayNotation,
                optionalFieldList
              ),
              //   {a b c}
              jsonPathPureDuckTyping = jsonPathClause(
                possiblyCapturing,
                namePlaceholder,
                fieldList
              ),
              //   ..
              jsonPathDoubleDot = jsonPathClause(/\.\./),
              //   .
              jsonPathDot = jsonPathClause(/\./),
              //   !
              jsonPathBang = jsonPathClause(possiblyCapturing, /!/),
              //   nada!
              emptyString = jsonPathClause(/$/);

            /* We export only a single function. When called, this function injects 
      into another function the descriptors from above.             
    */
            return function (fn) {
              return fn(
                lazyUnion(
                  jsonPathNamedNodeInObjectNotation,
                  jsonPathNamedNodeInArrayNotation,
                  jsonPathNumberedNodeInArrayNotation,
                  jsonPathPureDuckTyping
                ),
                jsonPathDoubleDot,
                jsonPathDot,
                jsonPathBang,
                emptyString
              );
            };
          })();
          /**
           * Get a new key->node mapping
           *
           * @param {String|Number} key
           * @param {Object|Array|String|Number|null} node a value found in the json
           */
          function namedNode(key, node) {
            return { key: key, node: node };
          }

          /** get the key of a namedNode */
          var keyOf = attr('key');

          /** get the node from a namedNode */
          var nodeOf = attr('node');
          /**
           * This file provides various listeners which can be used to build up
           * a changing ascent based on the callbacks provided by Clarinet. It listens
           * to the low-level events from Clarinet and emits higher-level ones.
           *
           * The building up is stateless so to track a JSON file
           * ascentManager.js is required to store the ascent state
           * between calls.
           */

          /**
           * A special value to use in the path list to represent the path 'to' a root
           * object (which doesn't really have any path). This prevents the need for
           * special-casing detection of the root object and allows it to be treated
           * like any other object. We might think of this as being similar to the
           * 'unnamed root' domain ".", eg if I go to
           * http://en.wikipedia.org./wiki/En/Main_page the dot after 'org' deliminates
           * the unnamed root of the DNS.
           *
           * This is kept as an object to take advantage that in Javascript's OO objects
           * are guaranteed to be distinct, therefore no other object can possibly clash
           * with this one. Strings, numbers etc provide no such guarantee.
           **/
          var ROOT_PATH = {};

          /**
           * Create a new set of handlers for clarinet's events, bound to the emit
           * function given.
           */
          function incrementalContentBuilder(oboeBus) {
            var emitNodeOpened = oboeBus(NODE_OPENED).emit,
              emitNodeClosed = oboeBus(NODE_CLOSED).emit,
              emitRootOpened = oboeBus(ROOT_PATH_FOUND).emit,
              emitRootClosed = oboeBus(ROOT_NODE_FOUND).emit;

            function arrayIndicesAreKeys(
              possiblyInconsistentAscent,
              newDeepestNode
            ) {
              /* for values in arrays we aren't pre-warned of the coming paths 
         (Clarinet gives no call to onkey like it does for values in objects) 
         so if we are in an array we need to create this path ourselves. The 
         key will be len(parentNode) because array keys are always sequential 
         numbers. */

              var parentNode = nodeOf(head(possiblyInconsistentAscent));

              return isOfType(Array, parentNode)
                ? keyFound(
                    possiblyInconsistentAscent,
                    len(parentNode),
                    newDeepestNode
                  )
                : // nothing needed, return unchanged
                  possiblyInconsistentAscent;
            }

            function nodeOpened(ascent, newDeepestNode) {
              if (!ascent) {
                // we discovered the root node,
                emitRootOpened(newDeepestNode);

                return keyFound(ascent, ROOT_PATH, newDeepestNode);
              }

              // we discovered a non-root node

              var arrayConsistentAscent = arrayIndicesAreKeys(
                  ascent,
                  newDeepestNode
                ),
                ancestorBranches = tail(arrayConsistentAscent),
                previouslyUnmappedName = keyOf(head(arrayConsistentAscent));

              appendBuiltContent(
                ancestorBranches,
                previouslyUnmappedName,
                newDeepestNode
              );

              return cons(
                namedNode(previouslyUnmappedName, newDeepestNode),
                ancestorBranches
              );
            }

            /**
             * Add a new value to the object we are building up to represent the
             * parsed JSON
             */
            function appendBuiltContent(ancestorBranches, key, node) {
              nodeOf(head(ancestorBranches))[key] = node;
            }

            /**
             * For when we find a new key in the json.
             *
             * @param {String|Number|Object} newDeepestName the key. If we are in an
             *    array will be a number, otherwise a string. May take the special
             *    value ROOT_PATH if the root node has just been found
             *
             * @param {String|Number|Object|Array|Null|undefined} [maybeNewDeepestNode]
             *    usually this won't be known so can be undefined. Can't use null
             *    to represent unknown because null is a valid value in JSON
             **/
            function keyFound(ascent, newDeepestName, maybeNewDeepestNode) {
              if (ascent) {
                // if not root

                // If we have the key but (unless adding to an array) no known value
                // yet. Put that key in the output but against no defined value:
                appendBuiltContent(ascent, newDeepestName, maybeNewDeepestNode);
              }

              var ascentWithNewPath = cons(
                namedNode(newDeepestName, maybeNewDeepestNode),
                ascent
              );

              emitNodeOpened(ascentWithNewPath);

              return ascentWithNewPath;
            }

            /**
             * For when the current node ends.
             */
            function nodeClosed(ascent) {
              emitNodeClosed(ascent);

              return (
                tail(ascent) ||
                // If there are no nodes left in the ascent the root node
                // just closed. Emit a special event for this:
                emitRootClosed(nodeOf(head(ascent)))
              );
            }

            var contentBuilderHandlers = {};
            contentBuilderHandlers[SAX_VALUE_OPEN] = nodeOpened;
            contentBuilderHandlers[SAX_VALUE_CLOSE] = nodeClosed;
            contentBuilderHandlers[SAX_KEY] = keyFound;
            return contentBuilderHandlers;
          }

          /**
           * The jsonPath evaluator compiler used for Oboe.js.
           *
           * One function is exposed. This function takes a String JSONPath spec and
           * returns a function to test candidate ascents for matches.
           *
           *  String jsonPath -> (List ascent) -> Boolean|Object
           *
           * This file is coded in a pure functional style. That is, no function has
           * side effects, every function evaluates to the same value for the same
           * arguments and no variables are reassigned.
           */
          // the call to jsonPathSyntax injects the token syntaxes that are needed
          // inside the compiler
          var jsonPathCompiler = jsonPathSyntax(function (
            pathNodeSyntax,
            doubleDotSyntax,
            dotSyntax,
            bangSyntax,
            emptySyntax
          ) {
            var CAPTURING_INDEX = 1;
            var NAME_INDEX = 2;
            var FIELD_LIST_INDEX = 3;

            var headKey = compose2(keyOf, head),
              headNode = compose2(nodeOf, head);

            /**
             * Create an evaluator function for a named path node, expressed in the
             * JSONPath like:
             *    foo
             *    ["bar"]
             *    [2]
             */
            function nameClause(previousExpr, detection) {
              var name = detection[NAME_INDEX],
                matchesName =
                  !name || name == '*'
                    ? always
                    : function (ascent) {
                        return headKey(ascent) == name;
                      };

              return lazyIntersection(matchesName, previousExpr);
            }

            /**
             * Create an evaluator function for a a duck-typed node, expressed like:
             *
             *    {spin, taste, colour}
             *    .particle{spin, taste, colour}
             *    *{spin, taste, colour}
             */
            function duckTypeClause(previousExpr, detection) {
              var fieldListStr = detection[FIELD_LIST_INDEX];

              if (!fieldListStr) return previousExpr; // don't wrap at all, return given expr as-is

              var hasAllrequiredFields = partialComplete(
                  hasAllProperties,
                  arrayAsList(fieldListStr.split(/\W+/))
                ),
                isMatch = compose2(hasAllrequiredFields, headNode);

              return lazyIntersection(isMatch, previousExpr);
            }

            /**
             * Expression for $, returns the evaluator function
             */
            function capture(previousExpr, detection) {
              // extract meaning from the detection
              var capturing = !!detection[CAPTURING_INDEX];

              if (!capturing) return previousExpr; // don't wrap at all, return given expr as-is

              return lazyIntersection(previousExpr, head);
            }

            /**
             * Create an evaluator function that moves onto the next item on the
             * lists. This function is the place where the logic to move up a
             * level in the ascent exists.
             *
             * Eg, for JSONPath ".foo" we need skip1(nameClause(always, [,'foo']))
             */
            function skip1(previousExpr) {
              if (previousExpr == always) {
                /* If there is no previous expression this consume command 
            is at the start of the jsonPath.
            Since JSONPath specifies what we'd like to find but not 
            necessarily everything leading down to it, when running
            out of JSONPath to check against we default to true */
                return always;
              }

              /** return true if the ascent we have contains only the JSON root,
               *  false otherwise
               */
              function notAtRoot(ascent) {
                return headKey(ascent) != ROOT_PATH;
              }

              return lazyIntersection(
                /* If we're already at the root but there are more 
                  expressions to satisfy, can't consume any more. No match.

                  This check is why none of the other exprs have to be able 
                  to handle empty lists; skip1 is the only evaluator that 
                  moves onto the next token and it refuses to do so once it 
                  reaches the last item in the list. */
                notAtRoot,

                /* We are not at the root of the ascent yet.
                  Move to the next level of the ascent by handing only 
                  the tail to the previous expression */
                compose2(previousExpr, tail)
              );
            }

            /**
             * Create an evaluator function for the .. (double dot) token. Consumes
             * zero or more levels of the ascent, the fewest that are required to find
             * a match when given to previousExpr.
             */
            function skipMany(previousExpr) {
              if (previousExpr == always) {
                /* If there is no previous expression this consume command 
            is at the start of the jsonPath.
            Since JSONPath specifies what we'd like to find but not 
            necessarily everything leading down to it, when running
            out of JSONPath to check against we default to true */
                return always;
              }

              var // In JSONPath .. is equivalent to !.. so if .. reaches the root
                // the match has succeeded. Ie, we might write ..foo or !..foo
                // and both should match identically.
                terminalCaseWhenArrivingAtRoot = rootExpr(),
                terminalCaseWhenPreviousExpressionIsSatisfied = previousExpr,
                recursiveCase = skip1(function (ascent) {
                  return cases(ascent);
                }),
                cases = lazyUnion(
                  terminalCaseWhenArrivingAtRoot,
                  terminalCaseWhenPreviousExpressionIsSatisfied,
                  recursiveCase
                );

              return cases;
            }

            /**
             * Generate an evaluator for ! - matches only the root element of the json
             * and ignores any previous expressions since nothing may precede !.
             */
            function rootExpr() {
              return function (ascent) {
                return headKey(ascent) == ROOT_PATH;
              };
            }

            /**
             * Generate a statement wrapper to sit around the outermost
             * clause evaluator.
             *
             * Handles the case where the capturing is implicit because the JSONPath
             * did not contain a '$' by returning the last node.
             */
            function statementExpr(lastClause) {
              return function (ascent) {
                // kick off the evaluation by passing through to the last clause
                var exprMatch = lastClause(ascent);

                return exprMatch === true ? head(ascent) : exprMatch;
              };
            }

            /**
             * For when a token has been found in the JSONPath input.
             * Compiles the parser for that token and returns in combination with the
             * parser already generated.
             *
             * @param {Function} exprs  a list of the clause evaluator generators for
             *                          the token that was found
             * @param {Function} parserGeneratedSoFar the parser already found
             * @param {Array} detection the match given by the regex engine when
             *                          the feature was found
             */
            function expressionsReader(exprs, parserGeneratedSoFar, detection) {
              // if exprs is zero-length foldR will pass back the
              // parserGeneratedSoFar as-is so we don't need to treat
              // this as a special case

              return foldR(
                function (parserGeneratedSoFar, expr) {
                  return expr(parserGeneratedSoFar, detection);
                },
                parserGeneratedSoFar,
                exprs
              );
            }

            /**
             *  If jsonPath matches the given detector function, creates a function which
             *  evaluates against every clause in the clauseEvaluatorGenerators. The
             *  created function is propagated to the onSuccess function, along with
             *  the remaining unparsed JSONPath substring.
             *
             *  The intended use is to create a clauseMatcher by filling in
             *  the first two arguments, thus providing a function that knows
             *  some syntax to match and what kind of generator to create if it
             *  finds it. The parameter list once completed is:
             *
             *    (jsonPath, parserGeneratedSoFar, onSuccess)
             *
             *  onSuccess may be compileJsonPathToFunction, to recursively continue
             *  parsing after finding a match or returnFoundParser to stop here.
             */
            function generateClauseReaderIfTokenFound(
              tokenDetector,
              clauseEvaluatorGenerators,

              jsonPath,
              parserGeneratedSoFar,
              onSuccess
            ) {
              var detected = tokenDetector(jsonPath);

              if (detected) {
                var compiledParser = expressionsReader(
                    clauseEvaluatorGenerators,
                    parserGeneratedSoFar,
                    detected
                  ),
                  remainingUnparsedJsonPath = jsonPath.substr(len(detected[0]));

                return onSuccess(remainingUnparsedJsonPath, compiledParser);
              }
            }

            /**
             * Partially completes generateClauseReaderIfTokenFound above.
             */
            function clauseMatcher(tokenDetector, exprs) {
              return partialComplete(
                generateClauseReaderIfTokenFound,
                tokenDetector,
                exprs
              );
            }

            /**
             * clauseForJsonPath is a function which attempts to match against
             * several clause matchers in order until one matches. If non match the
             * jsonPath expression is invalid and an error is thrown.
             *
             * The parameter list is the same as a single clauseMatcher:
             *
             *    (jsonPath, parserGeneratedSoFar, onSuccess)
             */
            var clauseForJsonPath = lazyUnion(
              clauseMatcher(
                pathNodeSyntax,
                list(capture, duckTypeClause, nameClause, skip1)
              ),

              clauseMatcher(doubleDotSyntax, list(skipMany)),

              // dot is a separator only (like whitespace in other languages) but
              // rather than make it a special case, use an empty list of
              // expressions when this token is found
              clauseMatcher(dotSyntax, list()),

              clauseMatcher(bangSyntax, list(capture, rootExpr)),

              clauseMatcher(emptySyntax, list(statementExpr)),

              function (jsonPath) {
                throw Error('"' + jsonPath + '" could not be tokenised');
              }
            );

            /**
             * One of two possible values for the onSuccess argument of
             * generateClauseReaderIfTokenFound.
             *
             * When this function is used, generateClauseReaderIfTokenFound simply
             * returns the compiledParser that it made, regardless of if there is
             * any remaining jsonPath to be compiled.
             */
            function returnFoundParser(_remainingJsonPath, compiledParser) {
              return compiledParser;
            }

            /**
             * Recursively compile a JSONPath expression.
             *
             * This function serves as one of two possible values for the onSuccess
             * argument of generateClauseReaderIfTokenFound, meaning continue to
             * recursively compile. Otherwise, returnFoundParser is given and
             * compilation terminates.
             */
            function compileJsonPathToFunction(
              uncompiledJsonPath,
              parserGeneratedSoFar
            ) {
              /**
               * On finding a match, if there is remaining text to be compiled
               * we want to either continue parsing using a recursive call to
               * compileJsonPathToFunction. Otherwise, we want to stop and return
               * the parser that we have found so far.
               */
              var onFind = uncompiledJsonPath
                ? compileJsonPathToFunction
                : returnFoundParser;

              return clauseForJsonPath(
                uncompiledJsonPath,
                parserGeneratedSoFar,
                onFind
              );
            }

            /**
             * This is the function that we expose to the rest of the library.
             */
            return function (jsonPath) {
              try {
                // Kick off the recursive parsing of the jsonPath
                return compileJsonPathToFunction(jsonPath, always);
              } catch (e) {
                throw Error(
                  'Could not compile "' + jsonPath + '" because ' + e.message
                );
              }
            };
          });

          /**
           * A pub/sub which is responsible for a single event type. A
           * multi-event type event bus is created by pubSub by collecting
           * several of these.
           *
           * @param {String} eventType
           *    the name of the events managed by this singleEventPubSub
           * @param {singleEventPubSub} [newListener]
           *    place to notify of new listeners
           * @param {singleEventPubSub} [removeListener]
           *    place to notify of when listeners are removed
           */
          function singleEventPubSub(eventType, newListener, removeListener) {
            /** we are optimised for emitting events over firing them.
             *  As well as the tuple list which stores event ids and
             *  listeners there is a list with just the listeners which
             *  can be iterated more quickly when we are emitting
             */
            var listenerTupleList, listenerList;

            function hasId(id) {
              return function (tuple) {
                return tuple.id == id;
              };
            }

            return {
              /**
               * @param {Function} listener
               * @param {*} listenerId
               *    an id that this listener can later by removed by.
               *    Can be of any type, to be compared to other ids using ==
               */
              on: function (listener, listenerId) {
                var tuple = {
                  listener: listener,
                  id: listenerId || listener, // when no id is given use the
                  // listener function as the id
                };

                if (newListener) {
                  newListener.emit(eventType, listener, tuple.id);
                }

                listenerTupleList = cons(tuple, listenerTupleList);
                listenerList = cons(listener, listenerList);

                return this; // chaining
              },

              emit: function () {
                applyEach(listenerList, arguments);
              },

              un: function (listenerId) {
                var removed;

                listenerTupleList = without(
                  listenerTupleList,
                  hasId(listenerId),
                  function (tuple) {
                    removed = tuple;
                  }
                );

                if (removed) {
                  listenerList = without(listenerList, function (listener) {
                    return listener == removed.listener;
                  });

                  if (removeListener) {
                    removeListener.emit(
                      eventType,
                      removed.listener,
                      removed.id
                    );
                  }
                }
              },

              listeners: function () {
                // differs from Node EventEmitter: returns list, not array
                return listenerList;
              },

              hasListener: function (listenerId) {
                var test = listenerId ? hasId(listenerId) : always;

                return defined(first(test, listenerTupleList));
              },
            };
          }

          /**
           * pubSub is a curried interface for listening to and emitting
           * events.
           *
           * If we get a bus:
           *
           *    var bus = pubSub();
           *
           * We can listen to event 'foo' like:
           *
           *    bus('foo').on(myCallback)
           *
           * And emit event foo like:
           *
           *    bus('foo').emit()
           *
           * or, with a parameter:
           *
           *    bus('foo').emit('bar')
           *
           * All functions can be cached and don't need to be
           * bound. Ie:
           *
           *    var fooEmitter = bus('foo').emit
           *    fooEmitter('bar');  // emit an event
           *    fooEmitter('baz');  // emit another
           *
           * There's also an uncurried[1] shortcut for .emit and .on:
           *
           *    bus.on('foo', callback)
           *    bus.emit('foo', 'bar')
           *
           * [1]: http://zvon.org/other/haskell/Outputprelude/uncurry_f.html
           */
          function pubSub() {
            var singles = {},
              newListener = newSingle('newListener'),
              removeListener = newSingle('removeListener');

            function newSingle(eventName) {
              return (singles[eventName] = singleEventPubSub(
                eventName,
                newListener,
                removeListener
              ));
            }

            /** pubSub instances are functions */
            function pubSubInstance(eventName) {
              return singles[eventName] || newSingle(eventName);
            }

            // add convenience EventEmitter-style uncurried form of 'emit' and 'on'
            ['emit', 'on', 'un'].forEach(function (methodName) {
              pubSubInstance[methodName] = varArgs(function (
                eventName,
                parameters
              ) {
                apply(parameters, pubSubInstance(eventName)[methodName]);
              });
            });

            return pubSubInstance;
          }

          /**
           * This file declares some constants to use as names for event types.
           */

          var // the events which are never exported are kept as
            // the smallest possible representation, in numbers:
            _S = 1,
            // fired whenever a new node starts in the JSON stream:
            NODE_OPENED = _S++,
            // fired whenever a node closes in the JSON stream:
            NODE_CLOSED = _S++,
            // called if a .node callback returns a value -
            NODE_SWAP = _S++,
            NODE_DROP = _S++,
            FAIL_EVENT = 'fail',
            ROOT_NODE_FOUND = _S++,
            ROOT_PATH_FOUND = _S++,
            HTTP_START = 'start',
            STREAM_DATA = 'data',
            STREAM_END = 'end',
            ABORTING = _S++,
            // SAX events butchered from Clarinet
            SAX_KEY = _S++,
            SAX_VALUE_OPEN = _S++,
            SAX_VALUE_CLOSE = _S++;

          function errorReport(statusCode, body, error) {
            try {
              var jsonBody = JSON.parse(body);
            } catch (e) {}

            return {
              statusCode: statusCode,
              body: body,
              jsonBody: jsonBody,
              thrown: error,
            };
          }

          /**
           *  The pattern adaptor listens for newListener and removeListener
           *  events. When patterns are added or removed it compiles the JSONPath
           *  and wires them up.
           *
           *  When nodes and paths are found it emits the fully-qualified match
           *  events with parameters ready to ship to the outside world
           */

          function patternAdapter(oboeBus, jsonPathCompiler) {
            var predicateEventMap = {
              node: oboeBus(NODE_CLOSED),
              path: oboeBus(NODE_OPENED),
            };

            function emitMatchingNode(emitMatch, node, ascent) {
              /* 
         We're now calling to the outside world where Lisp-style 
         lists will not be familiar. Convert to standard arrays. 
   
         Also, reverse the order because it is more common to 
         list paths "root to leaf" than "leaf to root"  */
              var descent = reverseList(ascent);

              emitMatch(
                node,

                // To make a path, strip off the last item which is the special
                // ROOT_PATH token for the 'path' to the root node
                listAsArray(tail(map(keyOf, descent))), // path
                listAsArray(map(nodeOf, descent)) // ancestors
              );
            }

            /*
             * Set up the catching of events such as NODE_CLOSED and NODE_OPENED and, if
             * matching the specified pattern, propagate to pattern-match events such as
             * oboeBus('node:!')
             *
             *
             *
             * @param {Function} predicateEvent
             *          either oboeBus(NODE_CLOSED) or oboeBus(NODE_OPENED).
             * @param {Function} compiledJsonPath
             */
            function addUnderlyingListener(
              fullEventName,
              predicateEvent,
              compiledJsonPath
            ) {
              var emitMatch = oboeBus(fullEventName).emit;

              predicateEvent.on(function (ascent) {
                var maybeMatchingMapping = compiledJsonPath(ascent);

                /* Possible values for maybeMatchingMapping are now:

          false: 
          we did not match 

          an object/array/string/number/null: 
          we matched and have the node that matched.
          Because nulls are valid json values this can be null.

          undefined:
          we matched but don't have the matching node yet.
          ie, we know there is an upcoming node that matches but we 
          can't say anything else about it. 
          */
                if (maybeMatchingMapping !== false) {
                  emitMatchingNode(
                    emitMatch,
                    nodeOf(maybeMatchingMapping),
                    ascent
                  );
                }
              }, fullEventName);

              oboeBus('removeListener').on(function (removedEventName) {
                // if the fully qualified match event listener is later removed, clean up
                // by removing the underlying listener if it was the last using that pattern:

                if (removedEventName == fullEventName) {
                  if (!oboeBus(removedEventName).listeners()) {
                    predicateEvent.un(fullEventName);
                  }
                }
              });
            }

            oboeBus('newListener').on(function (fullEventName) {
              var match = /(node|path):(.*)/.exec(fullEventName);

              if (match) {
                var predicateEvent = predicateEventMap[match[1]];

                if (!predicateEvent.hasListener(fullEventName)) {
                  addUnderlyingListener(
                    fullEventName,
                    predicateEvent,
                    jsonPathCompiler(match[2])
                  );
                }
              }
            });
          }

          /**
           * The instance API is the thing that is returned when oboe() is called.
           * it allows:
           *
           *    - listeners for various events to be added and removed
           *    - the http response header/headers to be read
           */
          function instanceApi(oboeBus, contentSource) {
            var oboeApi,
              fullyQualifiedNamePattern = /^(node|path):./,
              rootNodeFinishedEvent = oboeBus(ROOT_NODE_FOUND),
              emitNodeDrop = oboeBus(NODE_DROP).emit,
              emitNodeSwap = oboeBus(NODE_SWAP).emit,
              /**
               * Add any kind of listener that the instance api exposes
               */
              addListener = varArgs(function (eventId, parameters) {
                if (oboeApi[eventId]) {
                  // for events added as .on(event, callback), if there is a
                  // .event() equivalent with special behaviour , pass through
                  // to that:
                  apply(parameters, oboeApi[eventId]);
                } else {
                  // we have a standard Node.js EventEmitter 2-argument call.
                  // The first parameter is the listener.
                  var event = oboeBus(eventId),
                    listener = parameters[0];

                  if (fullyQualifiedNamePattern.test(eventId)) {
                    // allow fully-qualified node/path listeners
                    // to be added
                    addForgettableCallback(event, listener);
                  } else {
                    // the event has no special handling, pass through
                    // directly onto the event bus:
                    event.on(listener);
                  }
                }

                return oboeApi; // chaining
              }),
              /**
               * Remove any kind of listener that the instance api exposes
               */
              removeListener = function (eventId, p2, p3) {
                if (eventId == 'done') {
                  rootNodeFinishedEvent.un(p2);
                } else if (eventId == 'node' || eventId == 'path') {
                  // allow removal of node and path
                  oboeBus.un(eventId + ':' + p2, p3);
                } else {
                  // we have a standard Node.js EventEmitter 2-argument call.
                  // The second parameter is the listener. This may be a call
                  // to remove a fully-qualified node/path listener but requires
                  // no special handling
                  var listener = p2;

                  oboeBus(eventId).un(listener);
                }

                return oboeApi; // chaining
              };

            /**
             * Add a callback, wrapped in a try/catch so as to not break the
             * execution of Oboe if an exception is thrown (fail events are
             * fired instead)
             *
             * The callback is used as the listener id so that it can later be
             * removed using .un(callback)
             */
            function addProtectedCallback(eventName, callback) {
              oboeBus(eventName).on(protectedCallback(callback), callback);
              return oboeApi; // chaining
            }

            /**
             * Add a callback where, if .forget() is called during the callback's
             * execution, the callback will be de-registered
             */
            function addForgettableCallback(event, callback, listenerId) {
              // listenerId is optional and if not given, the original
              // callback will be used
              listenerId = listenerId || callback;

              var safeCallback = protectedCallback(callback);

              event.on(function () {
                var discard = false;

                oboeApi.forget = function () {
                  discard = true;
                };

                apply(arguments, safeCallback);

                delete oboeApi.forget;

                if (discard) {
                  event.un(listenerId);
                }
              }, listenerId);

              return oboeApi; // chaining
            }

            /**
             *  wrap a callback so that if it throws, Oboe.js doesn't crash but instead
             *  throw the error in another event loop
             */
            function protectedCallback(callback) {
              return function () {
                try {
                  return callback.apply(oboeApi, arguments);
                } catch (e) {
                  setTimeout(function () {
                    throw new Error(e.message);
                  });
                }
              };
            }

            /**
             * Return the fully qualified event for when a pattern matches
             * either a node or a path
             *
             * @param type {String} either 'node' or 'path'
             */
            function fullyQualifiedPatternMatchEvent(type, pattern) {
              return oboeBus(type + ':' + pattern);
            }

            function wrapCallbackToSwapNodeIfSomethingReturned(callback) {
              return function () {
                var returnValueFromCallback = callback.apply(this, arguments);

                if (defined(returnValueFromCallback)) {
                  if (returnValueFromCallback == oboe.drop) {
                    emitNodeDrop();
                  } else {
                    emitNodeSwap(returnValueFromCallback);
                  }
                }
              };
            }

            function addSingleNodeOrPathListener(eventId, pattern, callback) {
              var effectiveCallback;

              if (eventId == 'node') {
                effectiveCallback =
                  wrapCallbackToSwapNodeIfSomethingReturned(callback);
              } else {
                effectiveCallback = callback;
              }

              addForgettableCallback(
                fullyQualifiedPatternMatchEvent(eventId, pattern),
                effectiveCallback,
                callback
              );
            }

            /**
             * Add several listeners at a time, from a map
             */
            function addMultipleNodeOrPathListeners(eventId, listenerMap) {
              for (var pattern in listenerMap) {
                addSingleNodeOrPathListener(
                  eventId,
                  pattern,
                  listenerMap[pattern]
                );
              }
            }

            /**
             * implementation behind .onPath() and .onNode()
             */
            function addNodeOrPathListenerApi(
              eventId,
              jsonPathOrListenerMap,
              callback
            ) {
              if (isString(jsonPathOrListenerMap)) {
                addSingleNodeOrPathListener(
                  eventId,
                  jsonPathOrListenerMap,
                  callback
                );
              } else {
                addMultipleNodeOrPathListeners(eventId, jsonPathOrListenerMap);
              }

              return oboeApi; // chaining
            }

            // some interface methods are only filled in after we receive
            // values and are noops before that:
            oboeBus(ROOT_PATH_FOUND).on(function (rootNode) {
              oboeApi.root = functor(rootNode);
            });

            /**
             * When content starts make the headers readable through the
             * instance API
             */
            oboeBus(HTTP_START).on(function (_statusCode, headers) {
              oboeApi.header = function (name) {
                return name ? headers[name] : headers;
              };
            });

            /**
             * Construct and return the public API of the Oboe instance to be
             * returned to the calling application
             */
            return (oboeApi = {
              on: addListener,
              addListener: addListener,
              removeListener: removeListener,
              emit: oboeBus.emit,

              node: partialComplete(addNodeOrPathListenerApi, 'node'),
              path: partialComplete(addNodeOrPathListenerApi, 'path'),

              done: partialComplete(
                addForgettableCallback,
                rootNodeFinishedEvent
              ),
              start: partialComplete(addProtectedCallback, HTTP_START),

              // fail doesn't use protectedCallback because
              // could lead to non-terminating loops
              fail: oboeBus(FAIL_EVENT).on,

              // public api calling abort fires the ABORTING event
              abort: oboeBus(ABORTING).emit,

              // initially return nothing for header and root
              header: noop,
              root: noop,

              source: contentSource,
            });
          }

          /**
           * This file sits just behind the API which is used to attain a new
           * Oboe instance. It creates the new components that are required
           * and introduces them to each other.
           */

          function wire(
            httpMethodName,
            contentSource,
            body,
            headers,
            withCredentials
          ) {
            var oboeBus = pubSub();

            // Wire the input stream in if we are given a content source.
            // This will usually be the case. If not, the instance created
            // will have to be passed content from an external source.

            if (contentSource) {
              streamingHttp(
                oboeBus,
                httpTransport(),
                httpMethodName,
                contentSource,
                body,
                headers,
                withCredentials
              );
            }

            clarinet(oboeBus);

            ascentManager(oboeBus, incrementalContentBuilder(oboeBus));

            patternAdapter(oboeBus, jsonPathCompiler);

            return instanceApi(oboeBus, contentSource);
          }

          function applyDefaults(
            passthrough,
            url,
            httpMethodName,
            body,
            headers,
            withCredentials,
            cached
          ) {
            headers = headers
              ? // Shallow-clone the headers array. This allows it to be
                // modified without side effects to the caller. We don't
                // want to change objects that the user passes in.
                JSON.parse(JSON.stringify(headers))
              : {};

            if (body) {
              if (!isString(body)) {
                // If the body is not a string, stringify it. This allows objects to
                // be given which will be sent as JSON.
                body = JSON.stringify(body);

                // Default Content-Type to JSON unless given otherwise.
                headers['Content-Type'] =
                  headers['Content-Type'] || 'application/json';
              }
              headers['Content-Length'] =
                headers['Content-Length'] || body.length;
            } else {
              body = null;
            }

            // support cache busting like jQuery.ajax({cache:false})
            function modifiedUrl(baseUrl, cached) {
              if (cached === false) {
                if (baseUrl.indexOf('?') == -1) {
                  baseUrl += '?';
                } else {
                  baseUrl += '&';
                }

                baseUrl += '_=' + new Date().getTime();
              }
              return baseUrl;
            }

            return passthrough(
              httpMethodName || 'GET',
              modifiedUrl(url, cached),
              body,
              headers,
              withCredentials || false
            );
          }

          // export public API
          function oboe(arg1) {
            // We use duck-typing to detect if the parameter given is a stream, with the
            // below list of parameters.
            // Unpipe and unshift would normally be present on a stream but this breaks
            // compatibility with Request streams.
            // See https://github.com/jimhigson/oboe.js/issues/65

            var nodeStreamMethodNames = list('resume', 'pause', 'pipe'),
              isStream = partialComplete(
                hasAllProperties,
                nodeStreamMethodNames
              );

            if (arg1) {
              if (isStream(arg1) || isString(arg1)) {
                //  simple version for GETs. Signature is:
                //    oboe( url )
                //  or, under node:
                //    oboe( readableStream )
                return applyDefaults(
                  wire,
                  arg1 // url
                );
              } else {
                // method signature is:
                //    oboe({method:m, url:u, body:b, headers:{...}})

                return applyDefaults(
                  wire,
                  arg1.url,
                  arg1.method,
                  arg1.body,
                  arg1.headers,
                  arg1.withCredentials,
                  arg1.cached
                );
              }
            } else {
              // wire up a no-AJAX, no-stream Oboe. Will have to have content
              // fed in externally and using .emit.
              return wire();
            }
          }

          /* oboe.drop is a special value. If a node callback returns this value the
   parsed node is deleted from the JSON
 */
          oboe.drop = function () {
            return oboe.drop;
          };

          if (typeof define === 'function' && define.amd) {
            define('oboe', [], function () {
              return oboe;
            });
          } else if (typeof exports === 'object') {
            module.exports = oboe;
          } else {
            window.oboe = oboe;
          }
        })(
          (function () {
            // Access to the window object throws an exception in HTML5 web workers so
            // point it to "self" if it runs in a web worker
            try {
              return window;
            } catch (e) {
              return self;
            }
          })(),
          Object,
          Array,
          Error,
          JSON
        );
      },
      {},
    ],
  },
  {},
  [1]
);
