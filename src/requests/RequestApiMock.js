import Request from '@devoinc/applications-data-library/requests/Request';
/**
 * @class requests/RequestApiMock
 * @params
 */
export class RequestApiMock extends Request {
  constructor(options = {}) {
    super(options);
    this.type = options.format || 'json/compact';
    this.delay = options.delay || 0;
    this.results = options.results || {};

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

    if (this.autoRefresh > 0) super.refreshOntime(this.autoRefresh);
  }

  randomizeDelay() {
    if (!this.delay) return 0;

    var offset = this.delay / 3;
    var maxDelay = this.delay + offset;
    var minDelay = this.delay - offset;
    return Math.random() * (maxDelay - minDelay) + minDelay;
  }

  call(append = {}) {
    return new Promise((resolve, reject) => {
      var result = {
        cid: 'bcasdgc8a',
        msg: '',
        object: this.results,
        status: 0,
        timestamp: Date.now()
      };
      setTimeout(() => {
        resolve(this.processResponse(append, result));
      }, this.randomizeDelay());
    });
  }

  /**
   * Return the important data of the string to unique identify
   * @return {string}
   */
  toString() {
    return `
    type: ${this.type},
    dates: {
      from: ${this.dates.from} (${new Date(this.dates.from)}),
      to: ${this.dates.to} } (${new Date(this.dates.to)}),
    },
    query: MOCK`;
  }

  abort() {
    this.status = 'aborted';
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
    const fullResponse = Object.assign(result, append, {
      request: reqString,
      status: 0,
      dates: this.dates,
      type: this.type
    });
    return Promise.resolve(fullResponse);
  }
}

export default RequestApiMock;
