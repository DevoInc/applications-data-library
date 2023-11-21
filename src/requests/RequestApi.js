import Request from './Request';
import user from '@devoinc/applications-data-library/utils/user';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { addPragmas } from '@devoinc/applications-data-library/utils/request';
import { client } from '@devoinc/browser-sdk';

/**
 * @class requests/RequestSerrea
 * @params
 */
export class RequestApi extends Request {
  constructor(options = {}) {
    super(options);
    this.type = options.format || 'json/simple/compact';
    this._currentReq = {};
    // Check dates
    let now = Date.now();
    if (
      this.dates &&
      (this.dates.from > now ||
        this.dates.to > now ||
        this.dates.from > this.dates.to)
    ) {
      console.error(`Dates are invalid:
          ${new Date(this.dates.from)} -> ${new Date(this.dates.to)}.
          ${this.toString()}`);
    }

    if (this.autoRefresh > 0) {
      super.refreshOntime(this.autoRefresh);
    }

    const { serrea, standAloneToken } = user.getCredentials();
    let credentials = {};
    if (options.apiKey && options.apiSecret)
      credentials = { apiKey: options.apiKey, apiSecret: options.apiSecret };
    else if (options.token || options.apiToken)
      credentials = { apiToken: `Bearer ${options.token || options.apiToken}` };
    else credentials = { apiToken: `Bearer ${standAloneToken}` };
    this.client = client(
      {
        url: options.url || serrea,
        ...credentials
      },
      this.type
    );
  }

  call(append = {}) {
    return new Promise((resolve, reject) => {
      this.payload = this.getPayload();
      if (this.cache && this.cache.hash === this.getCacheHash()) {
        resolve(Object.assign({}, this.cache.data));
      } else {
        let hash = this.getCacheHash();
        if (this.status && this.status == 'busy' && this._currentReq[hash]) {
          let sleep = setInterval(() => {
            if (this.cache && this.cache.hash === hash) {
              clearInterval(sleep);
              resolve(Object.assign({}, this.cache.data));
            }
          }, 5);
        } else {
          this.status = 'busy';
          this._currentReq[hash] = {
            msg: '',
            status: 0,
            cid: null,
            object: {
              m: {},
              d: []
            }
          };

          this.stream = this.client.streamFetch(
            {
              query: this.query
                ? addPragmas(this.query, this.componentId, this.vault, this.application)
                : null,
              queryId: this.queryId ? this.queryId : null,
              timestamp: moment().valueOf(),
              dateFrom: this.dates.from,
              dateTo: this.dates.to,
              format: this.type || 'json/simple/compact',
              limit: this.limit ? this.limit : null,
              ipAsString: this.ipAsString || false
            },
            {
              meta: (headers) => {
                this._currentReq[hash].object.m = headers;
              },
              data: (data) => {
                this._currentReq[hash].object.d.push(...data);
              },
              error: (error) => {
                this.status = 'error';
                delete this._currentReq[hash];
                if (error) {
                  if (error.jsonBody) {
                    this.stream = null;
                    let response = this.processResponse(append, error.jsonBody);
                    resolve(Promise.resolve(Object.assign({}, response)));
                  } else {
                    setTimeout(() => {
                      if (this.stream) {
                        this.stream = null;
                        let response = this.processResponse(append, {
                          msg: error,
                          status: 500
                        });
                        resolve(Promise.resolve(Object.assign({}, response)));
                      }
                    }, 100);
                  }
                }
              },
              done: () => {
                if (append.id) console.log(append.id);
                if (this.type === 'json')
                  this._currentReq[hash].object =
                    this._currentReq[hash].object.d;
                else
                  this._currentReq[hash].object.d = this._currentReq[
                    hash
                  ].object.d.map((e) => Object.values(e));
                let response = this.processResponse(
                  append,
                  this._currentReq[hash]
                );
                delete this._currentReq[hash];
                this.stream = null;
                resolve(Promise.resolve(Object.assign({}, response)));
              }
            }
          );
        }
      }
    });
  }

  abort() {
    if (this.stream) {
      this.stream.abort();
      this.status = 'aborted';
    }
  }
  /**
   * Get custom Payload
   * @return {object}
   */
  getPayload() {
    this.fixDates();
    if (!this.url) {
      // If not url passed try to get from the context
      if (typeof lt !== 'undefined' && user.getCredentials().serrea) {
        this.url = user.getCredentials().serrea + '/query';
      } else {
        // If not url getted use local one
        this.url = 'search/query';
      }
    }
    return {
      from: this.dates.from / 1000,
      to: this.dates.to / 1000,
      query: this.query ? addPragmas(this.query, this.componentId, null, this.application) : null,
      queryId: this.queryId ? this.queryId : null,
      limit: this.limit ? this.limit : null,
      mode: { type: this.serrea_format }
    };
  }

  /**
   * Get hash
   * @return {string}
   */
  getCacheHash() {
    return window.btoa(
      toBinary(
        JSON.stringify({
          type: this.type,
          dates: {
            from: this.payload.dateFrom || this.payload.from,
            to: this.payload.dateTo || this.payload.to
          },
          query: this.payload.query
        })
      )
    );
  }

  /**
   * Return the important data of the string to unique identify
   * @return {string}
   */
  toString() {
    return `
    type: ${this.type},
    dates: {
      from: ${this.payload.from} (${new Date(this.payload.from)}),
      to: ${this.payload.to} } (${new Date(this.payload.to)}),
    },
    query: ${this.payload.query}`;
  }

  processResponse(append, result) {
    if (this.type === 'csv') {
      result = {
        msg: '',
        status: 0,
        cid: null,
        object: [result],
        success: true
      };
    }
    const reqString = this.toString();
    const fullResponse = Object.assign(
      {
        request: reqString,
        status: 0,
        dates: this.dates,
        type: this.type
      },
      result,
      append
    );
    this.createCache(fullResponse);
    this.status = Object.keys(this._currentReq) ? 'busy' : 'ready';
    return fullResponse;
  }

  createCache(response) {
    if (this.cache) {
      this.cache = {
        hash: this.getCacheHash(),
        data: Object.assign({}, response)
      };
    }
  }
}

/**
 * Get the sign for requests
 * @param {string} chunk - String to cypher
 * @param {string} secret - Key secret
 * @return {string}
 */
export function getSign(chunk, secret) {
  return HmacSHA256(chunk, secret).toString();
}

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

export default RequestApi;
