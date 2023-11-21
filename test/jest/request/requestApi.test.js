import '@babel/polyfill';

import RequestApi from '@devoinc/applications-data-library/requests/RequestApi';
jest.mock('@devoinc/applications-data-library/utils/user');
import moment from 'moment-timezone';
global.moment = moment;
const streamFetch = require('../../../node_modules/@devoinc/browser-sdk/lib/fetchStreamReadable/fetchStreamReadable.js');

let spyStreamFetch;


describe('API Request:', () => {
  global.fetch = require('jest-fetch-mock');
  global.fetch.mockResponse(
    `{
    "success":true,
    "status":0,
    "msg":"valid request",
    "object":[]
    }`,
    { headers: { 'content-type': 'json' } }
  );

  beforeEach(() => {
    spyStreamFetch = jest.spyOn(streamFetch, 'create')
      .mockImplementation(    () => {return{

        stream: (opc, callbacks) => {
          callbacks.done();
        }
   
      };}
      );
  });

  afterEach(() => {
    spyStreamFetch.mockRestore();
  });

  it('Should exist', () => {
    expect(RequestApi).toBeDefined();
  });

  it('Should create a new RequestApi when is invoked', () => {
    const req = new RequestApi();
    expect(req).toBeDefined();
    expect(req.method).toBe('GET');
    expect(req.cache).toEqual({ hash: null, data: null });
  });

  it(`Should create a new RequestApi with options
  when is invoked with options`, () => {
    const req = new RequestApi({
      template: `template`,
      searchTemplate: `searchtemplate`,
      dates: {
        from: 1,
        to: 2
      }
    });
    expect(req).toBeDefined();
    expect(req.template).toBe('template');
    expect(req.searchTemplate).toBe('searchtemplate');
    expect(req.dates).toEqual({ from: 1, to: 2 });
  });

  it(`Should generate a payload when call method is called`, () => {
    // const err = console.error;
    // console.error = jest.fn();

    const req = new RequestApi({
      url: 'http://localhost',
      query: `from proxy.zscaler.access
          group by hostname, clientIP, user
          select count() as count`,
      dates: {
        from: 1000,
        to: 2000
      }
    });

    const query = `from proxy.zscaler.access
          group by hostname, clientIP, user
          select count() as count
    pragma proc.vault.name: \"\"
    pragma comment.application: \"\"
    pragma comment.component: \"\"
    pragma comment.user: \"test\"
    pragma comment.email: \"test@test.com\"
    pragma comment.environment: \"localhost\"
    pragma comment.clone: ""
    pragma tz: tz(\"UTC\")
    pragma comment.source: \"from proxy.zscaler.access\\n          group by hostname, clientIP, user\\n          select count() as count\"
    pragma comment.free:\"123456\"`;
    req.call({ test: 'test' });
    expect(req.payload).toEqual({
      from: 1,
      mode: { type: undefined },
      query: query,
      queryId: null,
      limit: null,
      to: 2
    });
  });

  it(`Should call processResponse when call method is called`, async () => {
    const req = new RequestApi({
      url: 'http://localhost',
      query: `from proxy.zscaler.access
          group by hostname, clientIP, user
          select count() as count`,
      dates: {
        from: 1000,
        to: 2000
      },
      queryId: null,
      limit: null
    });
    const spy = jest.spyOn(req, 'processResponse');
    await req
      .call()
      .then((data) => {
        expect(spy).toHaveBeenCalledTimes(1);
      })
      .catch((data) => {
        expect(spy).toHaveBeenCalledTimes(0);
      });
  });

  it(`Should get a response when call method is called`, async () => {
    const req = new RequestApi({
      url: 'http://localhost',
      query: `from proxy.zscaler.access
          group by hostname, clientIP, user
          select count() as count`,
      dates: {
        from: 1000,
        to: 2000
      },
      queryId: null,
      limit: null
    });
    const spy = jest.spyOn(req, 'processResponse');

    await req
      .call({ test: 'test' })
      .then((data) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(data.success).toBeTruthy();
        expect(data.status).toBe(0);
        expect(data.msg).toBe('valid request');
        expect(data.object).toEqual([]);
      })
      .catch((data) => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
  });

  it(`Should use the apiKey and apiSecret from options
    in a new RequestApi when passed`, () => {
    const req = new RequestApi({
      template: `template`,
      searchTemplate: `searchtemplate`,
      apiKey: 'ABC',
      apiSecret: 'CDE'
    });
    expect(req).toBeDefined();
    expect(req.template).toBe('template');
    expect(req.searchTemplate).toBe('searchtemplate');
    expect(req.apiKey).toEqual('ABC');
    expect(req.apiSecret).toEqual('CDE');
  });
});
