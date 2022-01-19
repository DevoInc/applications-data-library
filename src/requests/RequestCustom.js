import Request from './Request';

export class RequestCustom extends Request {
  constructor(options = {}) {
    super(options);

    this._callFn = options.callFn;
  }

  call() {
    return new Promise((resolve, reject) => {
      if (this._callFn) {
        this.status = 'busy';
        this._callFn((result) => {
          resolve(this.processResponse(result));
        });
      } else resolve(this.processResponse({}));
    });
  }

  processResponse(result) {
    const reqString = this.toString();
    const fullResponse = {
      request: reqString,
      status: 0,
      object: result,
    };
    this.status = 'ready';
    return Promise.resolve(fullResponse);
  }

  abort() {
    this.status = 'aborted';
  }

  /**
   * Return the important data of the string to unique identify
   * @return {string}
   */
  toString() {
    return `
    type: custom,
    callFn: ${this._callFn.toString()}`;
  }
}

export default RequestCustom;
