/** @class requests/Request */
export class Request {
  /**
   * Constructor
   * @param {object} options - Options object
   */
  constructor(options) {
    Object.assign(
      this,
      {
        method: 'GET',
        headers: {},
        payload: null,
        convert: true,
        cache: true,
        debug: false,
        onChangeDates: null, // Use first param as dates
        autoRefresh: 0,
      },
      options
    );
    this.cache = { hash: null, data: null };
    this.xhr = null;
    this.status = 'ready';
    this.observers = {};
    this.type = 'raw';
  }

  /**
   * Set header to the request
   * @param {string} key - Key for the header
   * @param {string} val - Value of the header
   */
  setHeader(key, val) {
    this.headers[key] = val;
  }

  /**
   * Set the method for the request
   * @param {string} method - 'Get', 'Post', ...
   */
  setMethod(method) {
    this.method = method;
  }

  /**
   * Set the url for the request
   * @param {string} url
   */
  setURL(url) {
    this.url = url;
  }

  /**
   * Subscribe function to property
   * @param {string} prop - Property to subscribe
   * @param {function} func - Function to launch
   */
  subscribe(prop, func, params) {
    if (this.observers[prop]) this.observers[prop].push(func);
    else this.observers[prop] = [func];
  }

  /**
   * Trigger all subscribed functions to a prop
   * @param {string} [prop='change'] - Property to trigger
   */
  trigger(prop = 'change', params = null) {
    if (this.observers[prop]) {
      for (let func of this.observers[prop]) func(params);
    }
  }

  /**
   * Execute the request and return a Promise
   * @param {object} append - Object to append to the response
   * @return {Promise}
   */
  call(append = {}) {
    return new Promise((resolve, reject) => {
      if (this.cache && this.cache.hash === this.getCacheHash()) {
        // Resolve the cache data cloned
        resolve(Object.assign({}, this.cache.data));
      } else {
        if (this.status === 'busy') {
          this.xhr.addEventListener('load', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.processResponse(resolve, reject, append);
          });
          return;
        }
        this.xhr = new XMLHttpRequest();
        this.xhr.open(this.method, this.url);

        // Set headers
        for (var key in this.headers) {
          if (this.headers.hasOwnProperty(key)) {
            this.xhr.setRequestHeader(key, this.headers[key]);
          }
        }

        // Resolve callbacks with the promise
        this.xhr.addEventListener('load', (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          this.processResponse(resolve, reject, append);
        });
        this.xhr.onerror = () => {
          this.status = 'ready';
          reject(Error('Network Error'));
        };

        // Send the request with or without payload
        this.xhr.send(this.processPayload());
        this.status = 'busy';

        // Debug Query
        if (this.debug) console.debug(this.toString());
      }
    });
  }

  /**
   * Process the response as promised
   * @param {function} resolve - Resolve promised function
   * @param {function} reject - Reject promised function
   */
  processResponse(resolve, reject, append = {}) {
    this.status = 'ready';
    if (this.xhr.status === 200) {
      const parsed = JSON.parse(this.xhr.response);
      const fullResponse = Object.assign(parsed, append, {
        request: this.toString(),
      });
      if (this.cache) {
        this.cache = {
          hash: this.getCacheHash(),
          data: Object.assign({}, fullResponse),
        };
      }
      resolve(fullResponse);
    } else reject(Error(this.xhr.statusText));
  }

  /**
   * Process the payload by the type of the request
   * @return {string}
   */
  processPayload() {
    if (
      this.headers['Content-Type'] &&
      this.headers['Content-Type'].includes('x-www-form-urlencoded')
    ) {
      return param(this.payload);
    }
    return JSON.stringify(this.payload);
  }

  /**
   * Return the buffer key
   * @return {string} hash
   */
  getCacheHash() {
    return window.btoa(
      JSON.stringify({
        method: this.method,
        url: this.url,
        headers: this.headers,
      })
    );
  }

  /**
   * Return the important data of the string to unique identify
   * @return {string}
   */
  toString() {
    return `type: ${this.type},
      url: ${this.url},
      payload: ${this.payload}`;
  }

  refreshOntime(interval = 60000) {
    window.vapp_framework.registered_intervals = Object.is(
      window.vapp_framework.registered_intervals,
      undefined
    )
      ? []
      : window.vapp_framework.registered_intervals;
    let id = setInterval(() => {
      this.setDates(
        {
          from: this.dates.from + interval,
          to: this.dates.to + interval,
        },
        true
      );
    }, interval);
    window.vapp_framework.registered_intervals.push(id);

    this.subscribe('change', this.call.bind(this));
  }

  callOnInterval(interval = 60000, fn) {
    window.vapp_framework.registered_intervals = Object.is(
      window.vapp_framework.registered_intervals,
      undefined
    )
      ? []
      : window.vapp_framework.registered_intervals;

    let id = setInterval(() => {
      this.setDates({
        from: this.dates.from + interval,
        to: this.dates.to + interval,
      });
      this.call().then((data) => fn(data));
    }, interval);
    window.vapp_framework.registered_intervals.push(id);
    this.call().then((data) => fn(data));
  }

  /**
   * Set the dates
   * @param {object} dates - Dates to set
   * @param {Boolean} [trigger=true] False = not trigger the request change evt
   */
  setDates(dates, trigger = true) {
    this.dates = dates;
    if (trigger) this.trigger('change');
  }

  /**
   * Set the query
   * @param {string} query - Query to set
   * @param {Boolean} [trigger=true] False = not trigger the request change evt
   */
  setQuery(query, trigger = true) {
    this.query = query;
    if (trigger) this.trigger('change');
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
      this.status = 'aborted';
    }
  }

  /**
   * Set defaults dates if not exists ones (a day range from now).
   * Use exact day (DST not included).
   * @param {number} ts - Current timestamp
   */
  fixDates(ts) {
    if (!this.dates)
      this.dates = {
        from: ts - 1000 * 60 * 60 * 24, // One day before
        to: ts,
      };
  }

  /**
   * Replace the template and aply on query
   * @param {Object} obj - Object of terms to replace
   * @param {Boolean} [trigger=true] False = not trigger the request change evt
   */
  parseTemplate(obj, trigger = true) {
    if (this.template) {
      this.query = parseTemplate(this.template, obj);
      if (trigger) this.trigger('change');
    } else {
      console.error('No template found in query.');
    }
    return this;
  }
}
/**
 * Same function as in $.params()
 * @param {object} obj - Object to parametrize
 * @return {string}
 */
export function param(obj) {
  let s = [];
  let rbracket = /\[\]$/;
  let add = (k, v) => {
    v =
      typeof v === 'function'
        ? v()
        : v === null
        ? ''
        : v === undefined
        ? ''
        : v;
    s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
  };
  let buildParams = (prefix, obj) => {
    var i, len, key;
    if (prefix) {
      if (Array.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          if (rbracket.test(prefix)) {
            add(prefix, obj[i]);
          } else {
            buildParams(
              prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']',
              obj[i]
            );
          }
        }
      } else if (obj && String(obj) === '[object Object]') {
        for (key in obj) {
          buildParams(prefix + '[' + key + ']', obj[key]);
        }
      } else {
        add(prefix, obj);
      }
    } else if (Array.isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        add(obj[i].name, obj[i].value);
      }
    } else {
      for (key in obj) {
        buildParams(key, obj[key]);
      }
    }
    return s;
  };
  return buildParams('', obj).join('&').replace(/%20/g, '+');
}

/**
 * Parse a template with a key/value object that replace the content
 * NOTE: This function is externalized to use independant of the request
 * @param {String} tmpl Template for replacements
 * @param {Object} obj Key/Value object for replacement
 * @return {String} Query parsed returned
 */
export function parseTemplate(tmpl, obj) {
  let query = tmpl;
  let entries = Object.entries(obj);
  if (entries.length) {
    for (const [key, val] of Object.entries(obj)) {
      const re = new RegExp('{{\\s*' + key + '\\s*}}', 'gi');
      query = query.replace(re, val);
    }
  } else {
    const re = new RegExp('{{\\s*([^\\s]+)\\s*}}', 'gi');
    query = query.replace(re, '');
  }

  return query;
}
export default Request;
