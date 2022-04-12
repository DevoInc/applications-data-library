import '@babel/polyfill';

import RequestApi from '@devoinc/applications-data-library/requests/RequestApi';

import RequestChain from '@devoinc/applications-data-library/requests/RequestChain';
import mock from 'xhr-mock';
import user from '@devoinc/applications-data-library/utils/user';
jest.mock('@devoinc/applications-data-library/utils/user');
import moment from 'moment-timezone';
global.moment = moment;
const fs = require('fs');

const options = {};

/**
 * Tests for the RequestChain class
 */
describe('Request chain ', () => {
  global.fetch = require('jest-fetch-mock');
  beforeEach(() => {
    // Setup xhr-mock
    mock.setup();

    // Setup browser mocks
    // document.body.innerHTML = template;
    // global.stub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    // Teardown xhr-mock
    mock.teardown();

    // Remove browser mocks
    // global.navigator = undefined;
    // global.window = undefined;
    // global.stub.restore();
    // global.stub = undefined;
  });

  test('Bad arguments should fail', () => {
    //TODO: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX should be filled
  });

  test('Should handle inner exceptions correctly', () => {
    //TODO: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX should be filled
  });

  test('Should work with simple example of two requests', () => {
    let reqMalote1 = new RequestApi({
      url: 'endpoint1.json',
      template: `
          from mail.proofpoint.tapsiem
          select peek(threatURL, re("(http[s]?:\\\\/\\\\/)?(([A-Za-z0-9\\\\-\\\\.]+))"), 2) as hostname
          group by threatURL, classification, hostname, completelyRewritten
          select count() as count, first(eventdate) as Earliest, last(eventdate) as Latest
        `,
      dates: { from: '', to: '' },
    });
    reqMalote1.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [{ hostname: 'www.yahoo.com' }, { hostname: 'www.google.com' }],
      });
    };
    let reqMalote2 = new RequestApi({
      url: 'endpoint2.json',
      template: `
          from proxy.zscaler.access
          where hostname in {{hostnames}}
          group by hostname, clientIP, user
          select count() as count
        `,
      dates: { from: '', to: '' },
    });
    reqMalote2.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [{ hostname: 'www.yahoo.com' }, { hostname: 'www.google.com' }],
      });
    };
    let req = new RequestChain([
      reqMalote1,
      (data) => {
        return {
          hostnames: JSON.stringify(
            new Set(data.object.map((i) => i.hostname))
          ),
        };
      },
      reqMalote2,
    ]);

    req.parseTemplate({}, false);

    return req.call().then((result) => {
      console.log(result);
      expect(Array.isArray(result.object)).toBe(true);
      expect(result.object.length).toBe(2);
      expect(result.object[0]).toEqual({ hostname: 'www.yahoo.com' });
      expect(result.object[1]).toEqual({ hostname: 'www.google.com' });
    });
  });

  test('Should not call intermediate function when first request return no data', () => {
    const spy = jest.fn();
    let reqMalote1 = new RequestApi({
      url: 'endpoint1.json',
      template: `
          from mail.proofpoint.tapsiem
          select peek(threatURL, re("(http[s]?:\\\\/\\\\/)?(([A-Za-z0-9\\\\-\\\\.]+))"), 2) as hostname
          group by threatURL, classification, hostname, completelyRewritten
          select count() as count, first(eventdate) as Earliest, last(eventdate) as Latest
        `,
      dates: { from: '', to: '' },
    });
    reqMalote1.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [],
      });
    };
    let reqMalote2 = new RequestApi({
      url: 'endpoint2.json',
      template: `
          from proxy.zscaler.access
          where hostname in {{hostnames}}
          group by hostname, clientIP, user
          select count() as count
        `,
      dates: { from: '', to: '' },
    });
    reqMalote2.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [],
      });
    };
    let req = new RequestChain([
      reqMalote1,
      (data) => {
        spy();
        return {
          hostnames: JSON.stringify(
            new Set(data.object.map((i) => i.hostname))
          ),
        };
      },
      reqMalote2,
    ]);

    req.parseTemplate({}, false);

    return req.call().then((result) => {
      expect(spy).toBeCalledTimes(0);
      expect(Array.isArray(result.object)).toBe(true);
      expect(result.object.length).toBe(0);
    });
  });

  test('Should not call last request when intermediate function returns no data', () => {
    const spy = jest.fn();
    let reqMalote1 = new RequestApi({
      url: 'endpoint1.json',
      template: `
          from mail.proofpoint.tapsiem
          select peek(threatURL, re("(http[s]?:\\\\/\\\\/)?(([A-Za-z0-9\\\\-\\\\.]+))"), 2) as hostname
          group by threatURL, classification, hostname, completelyRewritten
          select count() as count, first(eventdate) as Earliest, last(eventdate) as Latest
        `,
      dates: { from: '', to: '' },
    });
    reqMalote1.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [{ hostname: 'www.yahoo.com' }, { hostname: 'www.google.com' }],
      });
    };
    let reqMalote2 = new RequestApi({
      url: 'endpoint2.json',
      template: `
          from proxy.zscaler.access
          where hostname in {{hostnames}}
          group by hostname, clientIP, user
          select count() as count
        `,
      dates: { from: '', to: '' },
    });
    reqMalote2.call = function () {
      return Promise.resolve({
        success: true,
        status: 0,
        msg: 'valid request',
        object: [{ hostname: 'www.yahoo.com' }, { hostname: 'www.google.com' }],
      });
    };
    let req = new RequestChain([
      reqMalote1,
      (data) => {
        return null;
      },
      reqMalote2,
    ]);

    req.parseTemplate({}, false);

    fetch.mockResponse(
      `{
      "success":true,
      "status":0,
      "msg":"valid request",
      "object":[
        { "hostname":"www.yahoo.com" },
        { "hostname":"www.google.com" }
      ]}`,
      { headers: { 'content-type': 'json' } }
    );

    return req.call().then((result) => {
      expect(spy).toBeCalledTimes(0);
      expect(Array.isArray(result.object)).toBe(true);
      expect(result.object.length).toBe(0);
    });
  });
});
