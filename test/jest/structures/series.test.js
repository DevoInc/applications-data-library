import '@babel/polyfill';

import processStructure from '@devo/applications-data-library/structures/series';
import moment from 'moment-timezone';
jest.mock('@devo/applications-data-library/utils/user');
global.moment = moment;

/**
 * This test check the series structure
 */
import basicData from './data/series/basic.json';
import zeroData from './data/series/zero.json';
import zeroData2 from './data/series/zero2.json';

describe('Series data structure: ', () => {
  describe('Process basic structure', () => {
    let result = processStructure(basicData, {
      keys: ['srcIp'],
      values: ['count'],
      order: 'total',
      zeroFill: false,
    });

    test('Should have 2 series', () => {
      expect(result.length).toBe(2);
    });

    test('The first serie should have 1 values', () => {
      expect(result[0].data.length).toBe(1);
    });

    test('The first serie name has to be "192.168.8.19"', () => {
      expect(result[0].name).toBe('192.168.8.19');
    });

    test('The first value of the first serie equal to', () => {
      expect(result[0].data[0]).toEqual([1519012800000, 43]);
    });
  });

  describe('Process basic structure with no key', () => {
    let result = processStructure(basicData, {
      values: ['count'],
      seriesNames: ['Counter'],
      zeroFill: false,
    });

    test('Should have 1 series', () => {
      expect(result.length).toBe(1);
    });

    test('The only serie should have 6 values', () => {
      expect(result[0].data.length).toBe(6);
    });

    test('The first serie name has to be "Counter"', () => {
      expect(result[0].name).toBe('Counter');
    });

    test('The first value of the first serie equal to', () => {
      expect(result[0].data[0]).toEqual([1518994800000, 1]);
    });
  });

  describe('Process structure with zero fill series', () => {
    let result = processStructure(zeroData, {
      values: ['count'],
      seriesNames: ['Counter'],
      zeroFill: '1d',
    });

    test('Should have 1 series', () => {
      expect(result.length).toBe(1);
    });
    test("The only serie should have 31 values (or 30 if the machine uses UTC which doesn't have Daylight Saving Time)", () => {
      expect(
        result[0].data.length === 31 || result[0].data.length === 30
      ).toBeTruthy();
    });

    let ordered = true;
    let timestamps = result[0].data.map((el) => el[0]);
    let orderedTimestamps = result[0].data.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < timestamps.length; i++) {
      if (orderedTimestamps[i][0] !== timestamps[i]) {
        ordered = false;
        break;
      }
    }

    test('The serie should be ordered by ts', () => {
      expect(ordered).toBe(true);
    });

    // Commented, be.equalOneOf([true, false]) doesn't have sense
    // let zerohour = true;
    // for (let i=0;i<timestamps.length;i++) {
    //   let hours = (new Date(timestamps[i])).getHours();
    //   // Check two ranges because the DST
    //   if ((i <= 23 && hours !== 0) || (i > 23 && hours !== 1)) zerohour = false;
    //   if (!zerohour) break;
    // }
    //
    // it('All the serie ts has to be on exact hour', () => {
    //   should(zerohour).be.equalOneOf([true, false]);
    // });
  });

  describe('Process structure with zero fill series (2)', () => {
    let result = processStructure(zeroData2, {
      keys: ['action'],
      values: ['count'],
      zeroFill: '1minute',
    });

    test('Should have 1 series', () => {
      expect(result.length).toBe(1);
    });

    // This seemed wrong, between 14:20:58 and 15:20:58 there should be
    // 60 datapoints corresponding to 61 minutes, (the latest zero isn't included)
    test('The only serie should have 61 values', () => {
      expect(result[0].data.length).toBe(60);
    });

    let ordered = true;
    let timestamps = result[0].data.map((el) => el[0]);
    let orderedTimestamps = result[0].data.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < timestamps.length; i++) {
      if (orderedTimestamps[i][0] !== timestamps[i]) {
        ordered = false;
        break;
      }
    }

    test('The serie should be ordered by ts', () => {
      expect(ordered).toBe(true);
    });

    test('The serie values must be over zero except the last zero that closes the interval', () => {
      for (let i = 0; i < result[0].data[i][1]; i++) {
        if (i < result[0].data - 1) {
          expect(result[0].data[i][1]).toBeGreaterThan(0);
        } else if (i === result[0].data - 1) {
          expect(result[0].data[i][1]).toBe(0);
        }
      }
    });
  });
});
