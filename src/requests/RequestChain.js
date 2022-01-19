import Request from './Request';
import { parseTemplate } from './Request';
import { checkArray, checkType } from '../utils/javascript/preconditions';

/**
 * Sequential chain of requests. From outside it behaves like
 * a RequestMalote or RequestMalote object but can contain multiple
 * requests inside.
 *
 * Each request will be executed sequentially, intermediate functions can be
 * configured so that results from one request can be adapted to parametrize
 * the next request.
 *
 * The parseTemplate  methods can be used and
 * will parametrize the first request.
 *
 * The getSearch method will return the search query of the first request.
 *
 * @class requests/RequestChain
 * */
export class RequestChain {
  _type;
  _chainUnits;
  _observers;
  _searchTemplate;

  /**
   * @param {Array} chainUnits array with a mix of functions and Request objects that
   * will be executed sequentially.
   * @param {string} searchTemplate version of the query compatible with loxcope
   */
  constructor(chainUnits = [], { searchTemplate = '' } = {}) {
    this._observers = {};
    this._chainUnits = chainUnits;
    this._type = 'RequestChain';
    this._searchTemplate = searchTemplate;

    if (!checkArray(this._chainUnits, [Request, 'function'])) {
      throw new Error(
        'Invalid argument: ' +
          'requests, requests must be an array with function and Request objects'
      );
    }
    if (
      this._chainUnits.length < 1 ||
      !checkType(this._chainUnits[0], Request)
    ) {
      throw new Error(
        'Invalid argument: ' +
          'requests, the first element must be a Request or Request derived object.'
      );
    }

    this.dates = this._chainUnits[0].dates;
  }

  /**
   * Replace the template and aply on query
   * @param {Object} obj - Object of terms to replace
   * @param {Boolean} [trigger=true] False = not trigger the request change evt
   */
  parseTemplate(obj, trigger = true) {
    if (this._chainUnits[0].template) {
      this._chainUnits[0].query = parseTemplate(
        this._chainUnits[0].template,
        obj
      );
      if (trigger) this.trigger('change');
    } else {
      console.error('No template found in query.');
    }
    return this;
  }

  /**
   * Set the dates
   * @param {object} dates - Dates to set
   * @param {Boolean} [trigger=true] False = not trigger the request change evt
   */
  setDates(dates, trigger = true) {
    this.dates = dates;
    for (let unit of this._chainUnits) {
      if (unit instanceof Request) {
        unit.setDates(dates, false);
      }
    }

    if (trigger) this.trigger('change');
  }

  /**
   * Get search object for Loxcope search
   * @return {object}
   */
  getSearch() {
    let q = this.search ? this.search : this.query;
    return { query: q, dates: this.dates };
  }

  call() {
    return Promise.resolve().then(() => {
      return this._callRecursion(0);
    });
  }

  abort() {
    this._chainUnits.forEach((req) => {
      if (req.abort && req.abort instanceof Function) req.abort();
    });
  }

  _callRecursion(idx, data) {
    let chainUnits = this._chainUnits;
    let chainUnit = chainUnits[idx];
    const emptyResult = {
      msg: '',
      status: 0,
      cid: null,
      object: [],
      success: true,
    };
    if (idx === this._chainUnits.length) {
      return data;
    } else {
      // Execute requests
      if (chainUnit instanceof Request) {
        if (idx > 1) {
          if (
            !data ||
            (data.object && data.object.d && !data.object.d.length) ||
            (data.object && !data.object.d && !data.object.length)
          ) {
            data = [];
            data.object = [];
            chainUnit.parseTemplate('', false);
            return Promise.resolve(emptyResult);
          }

          chainUnit.parseTemplate(data, false);
        }

        return chainUnit.call().then((data) => {
          if (
            !data ||
            (data.object && data.object.d && !data.object.d.length) ||
            (data.object && !data.object.d && !data.object.length)
          ) {
            chainUnits[chainUnits.length - 1].parseTemplate('', false);
            return Promise.resolve(emptyResult);
          }
          return this._callRecursion(idx + 1, data);
        });
      } else if (chainUnit instanceof Function) {
        // Execute intermediate functions
        return Promise.resolve(chainUnit(data)).then((data) => {
          return this._callRecursion(idx + 1, data);
        });
      }
    }
  }

  /**
   * Subscribe function to property
   * @param {string} prop - Property to subscribe
   * @param {function} func - Function to launch
   */
  subscribe(prop, func, params) {
    if (this._observers[prop]) this._observers[prop].push(func);
    else this._observers[prop] = [func];
  }

  /**
   * Trigger all subscribed functions to a prop
   * @param {string} [prop='change'] - Property to trigger
   */
  trigger(prop = 'change', params = null) {
    if (this._observers[prop]) {
      for (let func of this._observers[prop]) func(params);
    }
  }

  /**
   * Return the important data of the string to unique identify
   * @return {string}
   */
  toString() {
    let requests = '';
    for (let request of this.requests) {
      requests += request.toString();
    }

    return `type: ${this.type},
      requests ${requests}
      `;
  }
}

export default RequestChain;
