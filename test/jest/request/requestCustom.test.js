import '@babel/polyfill';

import RequestCustom from '@devoinc/applications-data-library/requests/RequestCustom';
import user from '@devoinc/applications-data-library/utils/user';
import { fn } from 'moment';
jest.mock('@devoinc/applications-data-library/utils/user');
import xhrMock from 'xhr-mock';
import moment from 'moment-timezone';
global.moment = moment;

describe('Custom Request:', () => {
  global.fetch = require('jest-fetch-mock');
  global.fetch.mockResponse(
    `{
    "status":0,
    "object":[]
    }`,
    { headers: { 'content-type': 'json' } }
  );

  it('Should exist', () => {
    expect(RequestCustom).toBeDefined();
  });

  it('Should create a new RequestCustom when is invoked', () => {
    const req = new RequestCustom();
    expect(req).toBeDefined();
  });

  it(`Should create a new RequestCustom with options
      when is invoked with options`, () => {
    const req = new RequestCustom({
      callFn: (cb) => {
        const result = ['a', 'b'];
        setTimeout(() => cb(result), 1000);
      },
    });
    expect(req).toBeDefined();
    expect(req.callFn).toBeDefined();
    expect(typeof req.callFn).toBe('function');
  });

  it(`Should call processResponse when call method is called`, async () => {
    const req = new RequestCustom({
      callFn: (cb) => {
        const result = ['a', 'b'];
        setTimeout(() => cb(result), 1000);
      },
    });
    const spy = jest.spyOn(req, 'processResponse');
    await req.call().then((data) => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it(`Should get a response when call method is called`, async () => {
    const req = new RequestCustom({
      callFn: (cb) => {
        const result = [];
        setTimeout(() => cb(result), 1000);
      },
    });
    const spy = jest.spyOn(req, 'processResponse');

    await req.call({ test: 'test' }).then((data) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(data.status).toBe(0);
      expect(data.object).toEqual([]);
    });
  });
});
